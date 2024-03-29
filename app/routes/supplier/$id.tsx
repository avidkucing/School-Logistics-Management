import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Detail from "~/components/detail";

import { deleteSupplier, getSupplier } from "~/models/supplier.server";
import { requireUserId } from "~/session.server";
import { forms } from "./new";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.id, "id not found");

  const supplier = await getSupplier({ userId, id: params.id });
  if (!supplier) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ supplier });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.id, "id not found");

  await deleteSupplier({ userId, id: params.id });

  return redirect("/supplier");
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <Detail data={data} forms={forms} type='supplier' />
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
