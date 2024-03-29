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
import { getFormData, injectOptions } from "~/utils";
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
      [`transaction_detail_notes_${index + 1}`]: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(detail.notes)],
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
      [`transaction_detail_notes_${index + details.length + 1}`]: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun("")],
      },
    }))
  ]
  const detailsPatch = Object.assign({}, ...detailsDocs)

  await patchDocument(fs.readFileSync("docs/BAPF.docx"), {
    patches: {
      supplier_name: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(supplier.name)],
      },
      supplier_npwp: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(supplier.npwp)],
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
      ...detailsPatch,
    }
  }).then((doc) => {
    fs.writeFileSync("public/bapf.docx", doc);
  });

  return redirect(`/bapf/download`);
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
