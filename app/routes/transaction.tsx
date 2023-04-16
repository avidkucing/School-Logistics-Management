import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getTransactionListItems } from "~/models/transaction.server";
import { getListItems } from "~/auth";
import { Overview } from "~/components/overview";

const title = 'Transaksi'

export async function loader({ request }: LoaderArgs) {
  return getListItems(request, getTransactionListItems);
}

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <Overview data={data} title={title} />
  );
}