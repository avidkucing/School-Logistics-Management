import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Detail from "~/components/detail";

import { deleteDetail, getDetail } from "~/models/detail.server";
import { forms } from "./new";

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.id, "id not found");
  
  const url = new URL(request.url)
  const transactionId = url.searchParams.get('trx') 
  invariant(transactionId, "transactionId not found");

  const detail = await getDetail({ transactionId, id: params.id });
  if (!detail) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ detail });
}

export async function action({ request, params }: ActionArgs) {
  invariant(params.id, "id not found");
  
  const url = new URL(request.url)
  const transactionId = url.searchParams.get('trx') 
  invariant(transactionId, "transactionId not found");

  await deleteDetail({ transactionId, id: params.id });

  return redirect("/detail?trx=" + transactionId);
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <Detail data={data} forms={forms} type='detail' titleKey="code" />
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
