import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import CustomForm from "~/components/custom_form";
import { getSchool, getSchoolListItems } from "~/models/school.server";

import { getTransaction, getTransactionListItems } from "~/models/transaction.server";
import { requireUserId } from "~/session.server";
import type { FormType } from "~/types";
import { getFormData, injectOptions, terbilang } from "~/utils";
import * as fs from "fs";
import {
  PatchType,
  TextRun,
  patchDocument,
} from "docx";
import { getDetails } from "~/models/detail.server";
import { getSupplier } from "~/models/supplier.server";

export const forms: FormType[] = [
  { name: "transactionId", type: "select", required: true, label: "Pilih Transaksi" },
  { name: "schoolId", type: "select", required: true, label: "Pilih Sekolah" },
]

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);

  const transactions = await getTransactionListItems({ userId });
  if (!transactions) {
    throw new Response("transactions not found", { status: 404 });
  }

  const schools = await getSchoolListItems({ userId });
  if (!schools) {
    throw new Response("schools not found", { status: 404 });
  }

  return json({ transactions, schools });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const { values, error } = getFormData(forms, formData);

  console.log(values, error)

  if (error) return error;
  const {
    transactionId,
    schoolId,
  } = values;

  const transaction = await getTransaction({ id: transactionId, userId });
  if (!transaction) {
    throw new Response("transaction not found", { status: 404 });
  }

  const school = await getSchool({ userId, id: schoolId });
  if (!school) {
    throw new Response("school not found", { status: 404 });
  }

  const supplier = await getSupplier({ userId, id: transaction.supplierId });
  if (!supplier) {
    throw new Response("supplier not found", { status: 404 });
  }

  const details = await getDetails({ transactionId });
  if (!details) {
    throw new Response("details not found", { status: 404 });
  }

  const transaction_detail_total_total = details.reduce((acc, detail) => acc + (parseInt(detail.total) || 0), 0)

  const detailsDocs = [
    ...details.map((detail, index) => ({
      [`transaction_detail_name_${index + 1}`]: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(detail.name)],
      },
      [`transaction_detail_amount_${index + 1}`]: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(detail.amount)],
      },
      [`transaction_detail_unit_${index + 1}`]: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(detail.unit)],
      },
      [`transaction_detail_unit_price_${index + 1}`]: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(detail.unit_price)],
      },
      [`transaction_detail_total_${index + 1}`]: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(detail.total)],
      },
    })),
    ...new Array(20 - details.length).fill(0).map((_, index) => ({
      [`transaction_detail_name_${index + details.length + 1}`]: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun("")],
      },
      [`transaction_detail_amount_${index + details.length + 1}`]: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun("")],
      },
      [`transaction_detail_unit_${index + details.length + 1}`]: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun("")],
      },
      [`transaction_detail_unit_price_${index + details.length + 1}`]: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun("")],
      },
      [`transaction_detail_total_${index + details.length + 1}`]: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun("")],
      },
    }))
  ]
  const detailsPatch = Object.assign({}, ...detailsDocs)

  await patchDocument(fs.readFileSync("docs/SPK.docx"), {
    patches: {
      transaction_spk_no: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(transaction.spk_no)],
      },
      transaction_spk_date: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(transaction.spk_date)],
      },
      transaction_duration: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(transaction.duration)],
      },
      transaction_duration_name: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(terbilang(transaction.duration))],
      },
      transaction_date_start: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(transaction.date_start)],
      },
      transaction_date_end: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(transaction.date_end)],
      },
      supplier_leader_name: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(supplier.leader_name)],
      },
      school_head_name: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(school.head_name)],
      },
      school_head_no: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(school.head_no)],
      },
      transaction_detail_total_total: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(transaction_detail_total_total + '')],
      },
      transaction_detail_total_total_name: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(terbilang(transaction_detail_total_total))],
      },
      transaction_name: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(transaction.name)],
      },
      transaction_code: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(transaction.code)],
      },
      transaction_date: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(transaction.date)],
      },
      ...detailsPatch,
    }
  }).then((doc) => {
    fs.writeFileSync("public/spk.docx", doc);
  });

  return redirect(`/spk/download`);
}

export default function NewNotePage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const ref = React.useRef<HTMLElement>(null);

  const transactions: FormType[] = data.transactions.map((transaction) => ({
    name: transaction.id,
    type: "text",
    required: true,
    label: transaction.code,
  }));

  const schools: FormType[] = data.schools.map((school) => ({
    name: school.id,
    type: "text",
    required: true,
    label: school.name,
  }));

  return (
    <>
      <CustomForm forms={
        injectOptions(injectOptions(forms, 'transactionId', transactions), 'schoolId', schools)
      } actionData={actionData} ref={ref} buttonLabel="Buat Dokumen" />
    </>
  );
}
