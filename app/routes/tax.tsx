import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";

import { getDetailListItems } from "~/models/detail.server";
import { getListItemsByTrx } from "~/auth";
import { Overview } from "~/components/overview";

const title = 'Detail Transaksi'

export async function loader({ request }: LoaderArgs) {
  return getListItemsByTrx(request, getDetailListItems);
}

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();
  let params = useLocation().search;

  return (
    <Overview data={data} title={title} extraParams={params} />
  );
}