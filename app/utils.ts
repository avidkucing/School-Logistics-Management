import type { TypedResponse } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { User } from "~/models/user.server";
import type { FormType } from "./types";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function getFormData(forms: FormType[], data: FormData) {
  let values: {[x: string]: string} = {};
  let error: TypedResponse<{errors: { [x: string]: string }, status: number }> | undefined;
  
  for (const form of forms) {
    if (!form.required) continue;

    if (form.type == 'date_range' && form.options) {
      const {values: _values, error: _error} = getFormData(form.options, data);
      if (_error) {
        error = _error;
        break;
      }
      values = {...values, ..._values};
      continue;
    }

    let value = data.get(form.name);
    if (typeof value !== "string" || value.length === 0 || value == null) {
      error = json(
        { errors: { [form.name]: `${form.label} perlu diisi` } },
        { status: 400 }
      );
      break;
    } else {
      values[form.name] = value;
    }
  }

  return {values, error};
}

export function injectOptions(forms: FormType[], input_name: string, options: FormType[]) {
  return forms.map(form => {
    if (form.name === input_name) {
      return {...form, options};
    }
    return form;
  });
}

export function injectValue(forms: FormType[], input_name: string, value: string) {
  return forms.map(form => {
    if (form.name === input_name) {
      return {...form, value};
    }
    return form;
  });
}

export function terbilang(a: number | string){
  if (typeof a === 'string') a = parseInt(a);

	let bilangan = ['','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan','Sepuluh','Sebelas'];
  let kalimat = "";

	// 1 - 11
	if(a < 12){
		kalimat = bilangan[a];
	}
	// 12 - 19
	else if(a < 20){
		kalimat = bilangan[a-10]+' Belas';
	}
	// 20 - 99
	else if(a < 100){
		let utama = a/10;
		let depan = parseInt(String(utama).substr(0,1));
		let belakang = a%10;
		kalimat = bilangan[depan]+' Puluh '+bilangan[belakang];
	}
	// 100 - 199
	else if(a < 200){
		kalimat = 'Seratus '+ terbilang(a - 100);
	}
	// 200 - 999
	else if(a < 1000){
		let utama = a/100;
		let depan = parseInt(String(utama).substr(0,1));
		let belakang = a%100;
		kalimat = bilangan[depan] + ' Ratus '+ terbilang(belakang);
	}
	// 1,000 - 1,999
	else if(a < 2000){
		kalimat = 'Seribu '+ terbilang(a - 1000);
	}
	// 2,000 - 9,999
	else if(a < 10000){
		let utama = a/1000;
		let depan = parseInt(String(utama).substr(0,1));
		let belakang = a%1000;
		kalimat = bilangan[depan] + ' Ribu '+ terbilang(belakang);
	}
	// 10,000 - 99,999
	else if(a < 100000){
		let utama = a/100;
		let depan = parseInt(String(utama).substr(0,2));
		let belakang = a%1000;
		kalimat = terbilang(depan) + ' Ribu '+ terbilang(belakang);
	}
	// 100,000 - 999,999
	else if(a < 1000000){
		let utama = a/1000;
		let depan = parseInt(String(utama).substr(0,3));
		let belakang = a%1000;
		kalimat = terbilang(depan) + ' Ribu '+ terbilang(belakang);
	}
	// 1,000,000 - 	99,999,999
	else if(a < 100000000){
		let utama = a/1000000;
		let depan = parseInt(String(utama).substr(0,4));
		let belakang = a%1000000;
		kalimat = terbilang(depan) + ' Juta '+ terbilang(belakang);
	}
	else if(a < 1000000000){
		let utama = a/1000000;
		let depan = parseInt(String(utama).substr(0,4));
		let belakang = a%1000000;
		kalimat = terbilang(depan) + ' Juta '+ terbilang(belakang);
	}
	else if(a < 10000000000){
		let utama = a/1000000000;
		let depan = parseInt(String(utama).substr(0,1));
		let belakang = a%1000000000;
		kalimat = terbilang(depan) + ' Milyar '+ terbilang(belakang);
	}
	else if(a < 100000000000){
		let utama = a/1000000000;
		let depan = parseInt(String(utama).substr(0,2));
		let belakang = a%1000000000;
		kalimat = terbilang(depan) + ' Milyar '+ terbilang(belakang);
	}
	else if(a < 1000000000000){
		let utama = a/1000000000;
		let depan = parseInt(String(utama).substr(0,3));
		let belakang = a%1000000000;
		kalimat = terbilang(depan) + ' Milyar '+ terbilang(belakang);
	}
	else if(a < 10000000000000){
		let utama = a/10000000000;
		let depan = parseInt(String(utama).substr(0,1));
		let belakang = a%10000000000;
		kalimat = terbilang(depan) + ' Triliun '+ terbilang(belakang);
	}
	else if(a < 100000000000000){
		let utama = a/1000000000000;
		let depan = parseInt(String(utama).substr(0,2));
		let belakang = a%1000000000000;
		kalimat = terbilang(depan) + ' Triliun '+ terbilang(belakang);
	}

	else if(a < 1000000000000000){
		let utama = a/1000000000000;
		let depan = parseInt(String(utama).substr(0,3));
		let belakang = a%1000000000000;
		kalimat = terbilang(depan) + ' Triliun '+ terbilang(belakang);
	}

  else if(a < 10000000000000000){
		let utama = a/1000000000000000;
		let depan = parseInt(String(utama).substr(0,1));
		let belakang = a%1000000000000000;
		kalimat = terbilang(depan) + ' Kuadriliun '+ terbilang(belakang);
	}

	let pisah = kalimat.split(' ');
	let full = [];
	for(let i=0;i<pisah.length;i++){
	 if(pisah[i] != ""){full.push(pisah[i]);}
	}
	return full.join(' ');
}