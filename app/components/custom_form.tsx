import { Form } from "@remix-run/react";
import type { FormType } from "~/types";


export default function CustomForm({
  forms,
  actionData,
  ref,
}: {
  forms: FormType[],
  actionData: any,
  ref: React.RefObject<any>,
}) {
  function generateErrors(name: string) {
    return actionData?.errors[name] && (
      <div className="pt-1 text-red-700" id="title-error">
        {actionData.errors[name]}
      </div>
    )
  }

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
      {forms.map(el => {
        const inputClass = "flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose" + (!el.disabled ? "" : " bg-gray-200")

        return <div key={el.name}>
          {el.type === 'text' ?
            <label className="flex w-full flex-col gap-1">
              <span>{el.label}: </span>
              <input
                ref={ref}
                name={el.name}
                className={inputClass}
                aria-invalid={actionData?.errors[el.name] ? true : undefined}
                aria-errormessage={
                  actionData?.errors[el.name] ? "title-error" : undefined
                }
                defaultValue={el.value}
                readOnly={el.disabled}
              />
            </label>
            : el.type === 'date' ?
              <label className="flex w-full flex-col gap-1">
                <span>{el.label}: </span>
                <input
                  ref={ref}
                  type="date"
                  name={el.name}
                  className={inputClass}
                  aria-invalid={actionData?.errors[el.name] ? true : undefined}
                  aria-errormessage={
                    actionData?.errors[el.name] ? "title-error" : undefined
                  }
                  defaultValue={el.value}
                  disabled={el.disabled}
                />
              </label>
              : el.type === 'date_range' ?
                <div className="flex w-full flex-col gap-1">
                  <span>{el.label}: </span>
                  <div className="flex w-full flex-row gap-1">
                    <label className="flex w-full flex-col gap-1">
                      <span>{el.options ? el.options[0].label : ''}: </span>
                      <input
                        ref={ref}
                        type="date"
                        name={el.options ? el.options[0].name : ''}
                        className={inputClass}
                        aria-invalid={actionData?.errors[el.name] ? true : undefined}
                        aria-errormessage={
                          actionData?.errors[el.name] ? "title-error" : undefined
                        }
                        defaultValue={el.value}
                        readOnly={el.disabled}
                      />
                    </label>
                    <label className="flex w-full flex-col gap-1">
                      <span>{el.options ? el.options[1].label : ''}: </span>
                      <input
                        ref={ref}
                        type="date"
                        name={el.options ? el.options[1].name : ''}
                        className={inputClass}
                        aria-invalid={actionData?.errors[el.name] ? true : undefined}
                        aria-errormessage={
                          actionData?.errors[el.name] ? "title-error" : undefined
                        }
                        defaultValue={el.value}
                        readOnly={el.disabled}
                      />
                    </label>
                  </div>
                </div>
                : el.type === 'select' ?
                  <label className="flex w-full flex-col gap-1">
                    <span>{el.label}: </span>
                    <select
                      ref={ref}
                      name={el.name}
                      className={inputClass}
                      aria-invalid={actionData?.errors[el.name] ? true : undefined}
                      aria-errormessage={
                        actionData?.errors[el.name] ? "title-error" : undefined
                      }
                      defaultValue={el.value}
                    >
                      <option value="">--Pilih--</option>
                      {el.options?.map((option, index) => (
                        <option key={index} value={option.name}>{option.label}</option>
                      ))}
                    </select>
                  </label>
                  : <label className="flex w-full flex-col gap-1">
                    <span>{el.label}: </span>
                    <textarea
                      ref={ref}
                      name={el.name}
                      rows={8}
                      className={"w-full " + inputClass}
                      aria-invalid={actionData?.errors[el.name] ? true : undefined}
                      aria-errormessage={
                        actionData?.errors[el.name] ? "body-error" : undefined
                      }
                      defaultValue={el.value}
                      readOnly={el.disabled}
                    />
                  </label>}
          {generateErrors(el.name)}
        </div>
      })}

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
