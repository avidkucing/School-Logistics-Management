import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import * as React from "react";
import CustomForm from "~/components/custom_form";

import { createSupplier } from "~/models/supplier.server";
import { requireUserId } from "~/session.server";
import type { FormType } from "~/types";
import { getFormData } from "~/utils";

const typeOptions = [
  { value: "barang", label: "Barang" },
  { value: "jasa", label: "Jasa" },
]

const dateRange = [
  { value: "start", label: "Dari" },
  { value: "end", label: "Sampai" },
]

const forms: FormType[] = [
  { name: "type", type: "select", required: true, label: "Tipe", options: typeOptions },
  { name: "code", type: "text", required: true, label: "Kode Rekening" },
  { name: "name", type: "text", required: true, label: "Nama Belanja" },
  { name: "supplier_id", type: "text", required: true, label: "Nama CV/Penyedia" },
  { name: "date", type: "date", required: true, label: "Tanggal Transaksi" },
  { name: "date_range", type: "date_range", required: true, label: "Waktu Pelaksanaan", options: dateRange },
  { name: "spk_no", type: "text", required: true, label: "No SPK" },
  { name: "spk_date", type: "text", required: true, label: "Tanggal SPK" },
  { name: "bap_no", type: "text", required: true, label: "No BAP" },
  { name: "bap_date", type: "textarea", required: true, label: "Tanggal BAP" },
  { name: "bast_no", type: "text", required: true, label: "No BAST" },
  { name: "bast_date", type: "text", required: true, label: "Tanggal BAST" },
  { name: "spp_no", type: "text", required: true, label: "No SPP" },
  { name: "spp_date", type: "text", required: true, label: "Tanggal SPP" },
]

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const { values, error } = getFormData(forms, formData);

  if (error) return error;
  const { name,
    leader_name,
    npwp,
    phone,
    address } = values;

  const supplier = await createSupplier({
    name,
    leader_name,
    npwp,
    phone,
    address,
    userId
  });

  return redirect(`/supplier/${supplier.id}`);
}

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const topRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors) {
      topRef.current?.focus();
    };
  }, [actionData]);

  return (
    <CustomForm forms={forms} actionData={actionData} topRef={topRef} bodyRef={bodyRef} />
  );
}
