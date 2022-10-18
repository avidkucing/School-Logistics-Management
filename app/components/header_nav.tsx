import { Form, Link } from "@remix-run/react";

import { useUser } from "~/utils";

export default function HeaderNav({title}: {title: string}) {
  const user = useUser();

  return (
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">{title}</Link>
        </h1>
        <p>{user.email}</p>
        <div className="flex flex-row">
          <Form action="/">
            <button
              type="submit"
              className="rounded bg-blue-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600 mr-2"
            >
              Kembali
            </button>
          </Form>
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Logout
            </button>
          </Form>
        </div>
      </header>
  );
}
