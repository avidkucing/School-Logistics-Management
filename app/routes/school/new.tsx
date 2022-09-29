import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";

import { createNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

const forms = [
  { name: "head_name", type: "text", required: true, label: "Nama Kepala Sekolah" },
  { name: "head_no", type: "text", required: true, label: "NIP Kepala Sekolah" },
  { name: "staff_name", type: "text", required: true, label: "Nama Bendahara" },
  { name: "staff_no", type: "text", required: true, label: "NIP Bendahara" },
  { name: "manager_name", type: "text", required: true, label: "Nama Pengelola Barang" },
  { name: "team_name", type: "text", required: true, label: "Nama Tim BOS" },
  { name: "team_no", type: "text", required: true, label: "NIP Tim Bos" },
  { name: "address", type: "textarea", required: true, label: "Alamat Sekolah" },
]

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { title: "Title is required", body: null } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { title: null, body: "Body is required" } },
      { status: 400 }
    );
  }

  const note = await createNote({ title, body, userId });

  return redirect(`/notes/${note.id}`);
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
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      {forms.map(el => el.type === 'text' ?
        <div key={el.name}>
          <label className="flex w-full flex-col gap-1">
            <span>{el.label}: </span>
            <input
              ref={topRef}
              name={el.name}
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.title ? true : undefined}
              aria-errormessage={
                actionData?.errors?.title ? "title-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.title && (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.title}
            </div>
          )}
        </div> : <div>
          <label className="flex w-full flex-col gap-1">
            <span>{el.label}: </span>
            <textarea
              ref={bodyRef}
              name={el.name}
              rows={8}
              className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
              aria-invalid={actionData?.errors?.body ? true : undefined}
              aria-errormessage={
                actionData?.errors?.body ? "body-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.body && (
            <div className="pt-1 text-red-700" id="body-error">
              {actionData.errors.body}
            </div>
          )}
        </div>
      )}

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
