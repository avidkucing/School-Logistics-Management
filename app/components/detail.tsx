import { Form } from "@remix-run/react";
import type { FormType } from "~/types";

export default function Detail({
  forms,
  data,
  type,
  titleKey = "name",
}: {
  forms: FormType[],
  data: any,
  type: string,
  titleKey?: string,
}) {
  return (
    <div>
      <h3 className="text-2xl font-bold pb-2">{data[type][titleKey]}</h3>
      {
        forms.map(form => <p key={form.name} className="pt-2">
          {form.label}: {data[type][form.name]}
      </p>)}
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Hapus
        </button>
      </Form>
    </div>
  );
}