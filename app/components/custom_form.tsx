import { Form } from "@remix-run/react";
import type { FormType } from "~/types";

export default function CustomForm({
  forms,
  actionData,
  topRef,
  bodyRef,
}: {
  forms: FormType[],
  actionData: any,
  topRef: React.RefObject<any>,
  bodyRef: React.RefObject<any>,
}) {
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
        </div> : <div key={el.name}>
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
          Simpan
        </button>
      </div>
    </Form>
  );
}
