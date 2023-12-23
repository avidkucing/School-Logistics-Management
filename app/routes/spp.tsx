import type { LoaderArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { getTransactionListItems } from "~/models/transaction.server";
import { getListItems } from "~/auth";
import HeaderNav from "~/components/header_nav";

export async function loader({ request }: LoaderArgs) {
  return getListItems(request, getTransactionListItems);
}

export default function NotesPage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <HeaderNav title="Cetak SPP" />

      <main className="flex h-full bg-white">
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}