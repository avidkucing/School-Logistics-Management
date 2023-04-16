import type { Transaction, Detail } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Detail } from "@prisma/client";

export function getDetail({
  id,
  transactionId,
}: Pick<Detail, "id"> & {
  transactionId: Transaction["id"];
}) {
  return prisma.detail.findFirst({
    where: { id, transactionId },
  });
}

export function getDetailListItems({ transactionId }: { transactionId: Transaction["id"] }) {
  return prisma.detail.findMany({
    where: { transactionId },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createDetail({
  name,
  amount,
  unit,
  unit_price,
  total,
  spec,
  notes,
  transactionId,
}: Pick<Detail,
  "name" |
  "amount" |
  "unit" |
  "unit_price" |
  "total" |
  "spec" |
  "notes"> & {
    transactionId: Transaction["id"];
  }) {
  return prisma.detail.create({
    data: {
      name,
      amount,
      unit,
      unit_price,
      total,
      spec,
      notes,
      transaction: {
        connect: {
          id: transactionId,
        },
      },
    },
  });
}

export function deleteDetail({
  id,
  transactionId,
}: Pick<Detail, "id"> & { transactionId: Transaction["id"] }) {
  return prisma.detail.deleteMany({
    where: { id, transactionId },
  });
}
