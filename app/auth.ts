import { json } from "@remix-run/node";
import { requireUserId } from "./session.server";
import type { PrismaPromise, Transaction, User } from "@prisma/client";

export async function getListItems(
    request: Request,
    getItems: (x: {userId: User["id"]}) => 
        PrismaPromise<{
            id: string;
            name: string;
        }[]>,
) {
    const userId = await requireUserId(request);
    const listItems = await getItems({ userId });
    return json({ listItems });
}

export async function getListItemsByTrx(
    request: Request,
    getItems: (x: {transactionId: Transaction["id"]}) => 
        PrismaPromise<{
            id: string;
            name: string;
        }[]>,
) {
    const url = new URL(request.url)
    const transactionId = url.searchParams.get('trx')
    if (!transactionId) {
        return json({ listItems: [] });
    }
    const listItems = await getItems({ transactionId });
    return json({ listItems });
}