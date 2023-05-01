import type { ActionArgs} from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import invariant from "tiny-invariant";
import CustomForm from "~/components/custom_form";
import { createDetail } from "~/models/detail.server";
import { getTransactionCode } from "~/models/transaction.server";

import type { FormType } from "~/types";
import { getFormData, injectValue } from "~/utils";

export const forms: FormType[] = [
  { name: "code", type: "text", required: true, disabled: true, label: "Kode Transaksi" },
  { name: "name", type: "textarea", required: true, label: "Uraian" },
  { name: "amount", type: "text", required: true, label: "Jumlah" },
  { name: "unit", type: "text", required: true, label: "Satuan" },
  { name: "unit_price", type: "text", required: true, label: "Harga Satuan (Rp)" },
  { name: "total", type: "text", required: true, label: "Total" },
  { name: "spec", type: "text", required: true, label: "Spesifikasi" },
  { name: "notes", type: "text", required: true, label: "Keterangan" },
]

export async function loader({ request }: ActionArgs) {
  const url = new URL(request.url)
  const transactionId = url.searchParams.get('trx')
  invariant(transactionId, "transactionId not found");

  const transaction = await getTransactionCode({ id: transactionId });
  if (!transaction) {
    throw new Response("Transaction not Found", { status: 404 });
  }
  return json({ transaction });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { values, error } = getFormData(forms, formData);

  console.log(values, error)

  if (error) return error;
  const {
    name,
    amount,
    unit,
    unit_price,
    total,
    spec,
    notes,
  } = values;

  const url = new URL(request.url)
  const transactionId = url.searchParams.get('trx') 
  invariant(transactionId, "transactionId not found");

  const detail = await createDetail({
    transactionId,
    name,
    amount,
    unit,
    unit_price,
    total,
    spec,
    notes,
  });

  return redirect(`/detail/${detail.id}?trx=${transactionId}`);
}

export default function NewNotePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (actionData?.errors) {
      ref.current?.focus();
    };
  }, [actionData]);

  return (
    <CustomForm forms={injectValue(forms, 'code', data.transaction.code)} actionData={actionData} ref={ref} />
  );
}
