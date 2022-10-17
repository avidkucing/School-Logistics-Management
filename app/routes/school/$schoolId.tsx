import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteSchool, getSchool } from "~/models/school.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.schoolId, "schoolId not found");

  const school = await getSchool({ userId, id: params.schoolId });
  if (!school) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ school });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.schoolId, "schoolId not found");

  await deleteSchool({ userId, id: params.schoolId });

  return redirect("/notes");
}

const labels = [
  "head_name",
  "head_no",
  "staff_name",
  "staff_no",
  "manager_name",
  "team_name",
  "team_no",
  "address",
]

export default function NoteDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.school.name}</h3>
      {Object.values(data.school).map((value, id) => 
        labels.includes(value) && <p key={id} className="py-6">{value}</p>)}
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
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
