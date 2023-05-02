import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import CustomForm from "~/components/custom_form";
import { getSupplierListItems } from "~/models/supplier.server";

import { createTransaction } from "~/models/transaction.server";
import { requireUserId } from "~/session.server";
import type { FormType } from "~/types";
import { getFormData, injectOptions } from "~/utils";

const typeOptions: FormType[] = [
  { name: "barang", type: "barang", required: true, label: "Barang" },
  { name: "jasa", type: "jasa", required: true, label: "Jasa" },
]

const dateRange = [
  { name: "date_start", type: "date_start", required: true, label: "Dari" },
  { name: "date_end", type: "date_end", required: true, label: "Sampai" },
]

export const forms: FormType[] = [
  { name: "type", type: "select", required: true, label: "Tipe", options: typeOptions },
  { name: "code", type: "text", required: true, label: "Kode Rekening" },
  { name: "name", type: "text", required: true, label: "Nama Belanja" },
  { name: "supplierId", type: "select", required: true, label: "Nama CV/Penyedia" },
  { name: "date", type: "date", required: true, label: "Tanggal Transaksi" },
  { name: "duration", type: "text", required: true, label: "Waktu Pelaksanaan (hari)" },
  { name: "date_range", type: "date_range", required: true, label: "", options: dateRange },
  { name: "spk_no", type: "text", required: true, label: "No SPK" },
  { name: "spk_date", type: "date", required: true, label: "Tanggal SPK" },
  { name: "bap_no", type: "text", required: true, label: "No BAP" },
  { name: "bap_date", type: "date", required: true, label: "Tanggal BAP" },
  { name: "bast_no", type: "text", required: true, label: "No BAST" },
  { name: "bast_date", type: "date", required: true, label: "Tanggal BAST" },
  { name: "spp_no", type: "text", required: true, label: "No SPP" },
  { name: "spp_date", type: "date", required: true, label: "Tanggal SPP" },
]

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);

  const suppliers = await getSupplierListItems({ userId });
  if (!suppliers) {
    throw new Response("Not Found", { status: 404 });
  }

  console.log(suppliers)
  return json({ suppliers });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const { values, error } = getFormData(forms, formData);

  console.log(values, error)

  if (error) return error;
  const { 
    type,
    code,
    name,
    supplierId,
    date,
    date_start,
    date_end,
    spk_no,
    spk_date,
    bap_no,
    bap_date,
    bast_no,
    bast_date,
    spp_no,
    spp_date, 
    duration,
  } = values;

  const transaction = await createTransaction({
    type,
    code,
    name,
    supplierId,
    date,
    date_start,
    date_end,
    spk_no,
    spk_date,
    bap_no,
    bap_date,
    bast_no,
    bast_date,
    spp_no,
    spp_date,
    duration,
    userId
  });

  return redirect(`/transaction/${transaction.id}`);
}

export default function NewNotePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const ref = React.useRef<HTMLElement>(null);

  const suppliers: FormType[] = data.suppliers.map((supplier) => ({
    name: supplier.id,
    type: "text",
    required: true,
    label: supplier.name,
  }));

  React.useEffect(() => {
    if (actionData?.errors) {
      ref.current?.focus();
    };
  }, [actionData]);

  return (
    <CustomForm forms={injectOptions(forms, 'supplierId', suppliers)} actionData={actionData} ref={ref} />
  );
}
