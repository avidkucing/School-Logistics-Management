import { Link, NavLink, Outlet } from "@remix-run/react";

import HeaderNav from "~/components/header_nav";

export function Overview({
  data,
  title,
  extraParams = '',
  noAdd = false,
}: {
  data: {
    listItems: {
      id: string
      name: string
    }[]
  },
  title: string,
  extraParams?: string,
  noAdd?: boolean,
}) {
  const title_lower = title.toLowerCase()

  return (
    <div className="flex h-full min-h-screen flex-col">
      <HeaderNav title={"Data " + title} />

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          {!noAdd && <Link to={"new" + extraParams} className="block p-4 text-xl text-blue-500">
            + Tambah {title}
          </Link>}

          <hr />

          {data.listItems.length === 0 ? (
            <p className="p-4">Belum ada {title_lower}</p>
          ) : (
            <ol>
              {data.listItems.map((data) => (
                <li key={data.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={data.id + extraParams}
                  >
                    {data.name}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}