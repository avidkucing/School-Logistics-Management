import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getSchoolListItems } from "~/models/school.server";
import HeaderNav from "~/components/header_nav";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const schoolListItems = await getSchoolListItems({ userId });
  return json({ schoolListItems });
}

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <HeaderNav title="Data Penyedia" />

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + Tambah Penyedia
          </Link>

          <hr />

          {data.schoolListItems.length === 0 ? (
            <p className="p-4">Belum ada penyedia</p>
          ) : (
            <ol>
              {data.schoolListItems.map((school) => (
                <li key={school.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={school.id}
                  >
                    {school.name}
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
