import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Detail from "~/components/detail";

import { deleteSchool, getSchool } from "~/models/school.server";
import { requireUserId } from "~/session.server";
import { forms } from "./new";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.id, "id not found");

  const school = await getSchool({ userId, id: params.id });
  if (!school) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ school });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.id, "id not found");

  await deleteSchool({ userId, id: params.id });

  return redirect("/school");
}

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <Detail data={data} forms={forms} type='school' />
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
