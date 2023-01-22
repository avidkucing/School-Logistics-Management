import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import HeaderNav from "~/components/header_nav";
import { getSupplierListItems } from "~/models/supplier.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const supplierListItems = await getSupplierListItems({ userId });
  return json({ supplierListItems });
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

          {data.supplierListItems.length === 0 ? (
            <p className="p-4">Belum ada penyedia</p>
          ) : (
            <ol>
              {data.supplierListItems.map((supplier) => (
                <li key={supplier.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={supplier.id}
                  >
                    {supplier.name}
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
