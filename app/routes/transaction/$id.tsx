import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Detail from "~/components/detail";

import { deleteTransaction, getTransaction } from "~/models/transaction.server";
import { requireUserId } from "~/session.server";
import { forms } from "./new";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.id, "id not found");

  const transaction = await getTransaction({ userId, id: params.id });
  if (!transaction) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ transaction });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.id, "id not found");

  await deleteTransaction({ userId, id: params.id });

  return redirect("/transaction");
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <Detail data={data} forms={forms} type='transaction' titleKey="code" />
      <h3 className="text-2xl font-bold pb-2">Detail Transaksi</h3>
      <div>
        <Form action={"/detail?trx=" + data.transaction.id} >
          <button
            type="submit"
            className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Tambah
          </button>
        </Form>
      </div>
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
