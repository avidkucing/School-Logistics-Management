import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import * as React from "react";
import CustomForm from "~/components/custom_form";

import { createTransaction } from "~/models/transaction.server";
import { requireUserId } from "~/session.server";
import type { FormType } from "~/types";
import { getFormData } from "~/utils";

const typeOptions: FormType[] = [
  { name: "barang", type: "barang", required: true, label: "Barang" },
  { name: "jasa", type: "jasa", required: true, label: "Jasa" },
]

const dateRange = [
  { name: "date_start", type: "date_start", required: true, label: "Dari" },
  { name: "date_end", type: "date_end", required: true, label: "Sampai" },
]

const forms: FormType[] = [
  { name: "type", type: "select", required: true, label: "Tipe", options: typeOptions },
  { name: "code", type: "text", required: true, label: "Kode Rekening" },
  { name: "name", type: "text", required: true, label: "Nama Belanja" },
  { name: "supplierId", type: "text", required: true, label: "Nama CV/Penyedia" },
  { name: "date", type: "date", required: true, label: "Tanggal Transaksi" },
  { name: "date_range", type: "date_range", required: true, label: "Waktu Pelaksanaan", options: dateRange },
  { name: "spk_no", type: "text", required: true, label: "No SPK" },
  { name: "spk_date", type: "date", required: true, label: "Tanggal SPK" },
  { name: "bap_no", type: "text", required: true, label: "No BAP" },
  { name: "bap_date", type: "date", required: true, label: "Tanggal BAP" },
  { name: "bast_no", type: "text", required: true, label: "No BAST" },
  { name: "bast_date", type: "date", required: true, label: "Tanggal BAST" },
  { name: "spp_no", type: "text", required: true, label: "No SPP" },
  { name: "spp_date", type: "date", required: true, label: "Tanggal SPP" },
]

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
  } = values;

  const supplier = await createTransaction({
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
    userId
  });

  return redirect(`/supplier/${supplier.id}`);
}

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (actionData?.errors) {
      ref.current?.focus();
    };
  }, [actionData]);

  return (
    <CustomForm forms={forms} actionData={actionData} ref={ref} />
  );
}
