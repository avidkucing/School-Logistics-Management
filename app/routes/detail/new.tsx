import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import CustomForm from "~/components/custom_form";
import { createDetail } from "~/models/detail.server";

import { getTransactionListItems } from "~/models/transaction.server";
import { requireUserId } from "~/session.server";
import type { FormType } from "~/types";
import { getFormData, injectOptions } from "~/utils";

export const forms: FormType[] = [
  { name: "code", type: "select", required: true, label: "Kode Transaksi" },
  { name: "name", type: "text", required: true, label: "Uraian" },
  { name: "amount", type: "text", required: true, label: "Jumlah" },
  { name: "unit", type: "text", required: true, label: "Satuan" },
  { name: "unit_price", type: "text", required: true, label: "Harga Satuan (Rp)" },
  { name: "total", type: "text", required: true, label: "Total" },
  { name: "spec", type: "text", required: true, label: "Spesifikasi" },
  { name: "notes", type: "text", required: true, label: "Keterangan" },
]

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);

  const trx = await getTransactionListItems({ userId });
  if (!trx) {
    throw new Response("Not Found", { status: 404 });
  }

  console.log(trx)
  return json({ trx });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { values, error } = getFormData(forms, formData);

  console.log(values, error)

  if (error) return error;
  const {
    code,
    name,
    amount,
    unit,
    unit_price,
    total,
    spec,
    notes,
  } = values;

  const detail = await createDetail({
    transactionId: code,
    name,
    amount,
    unit,
    unit_price,
    total,
    spec,
    notes,
  });

  return redirect(`/detail/${detail.id}`);
}

export default function NewNotePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const ref = React.useRef<HTMLElement>(null);

  const trx: FormType[] = data.trx.map((transaction) => ({
    name: transaction.id,
    type: "text",
    required: true,
    label: transaction.code,
  }));

  React.useEffect(() => {
    if (actionData?.errors) {
      ref.current?.focus();
    };
  }, [actionData]);

  return (
    <CustomForm forms={injectOptions(forms, 'code', trx)} actionData={actionData} ref={ref} />
  );
}
