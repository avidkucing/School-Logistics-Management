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
      <div className="flex">
        <div className="flex-1">
          {
            forms.map(form =>
              form.type === 'date_range' ?
                form.options?.map(el =>
                  <p key={el.name} className="pt-2">
                    {el.label}: {data[type][el.name]}
                  </p>
                )
                :
                <p key={form.name} className="pt-2">
                  {form.label}: {data[type][form.name]}
                </p>)}
        </div>
        <div>
          <Form method="post">
            <button
              type="submit"
              className="rounded bg-red-500  py-2 px-4 text-white hover:bg-red-600 focus:bg-red-400"
            >
              Hapus
            </button>
          </Form>
        </div>
      </div>
      <hr className="my-4" />
    </div>
  );
}