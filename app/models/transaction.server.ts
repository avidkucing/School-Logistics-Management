import type { User, Transaction, Supplier } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Transaction } from "@prisma/client";

export function getTransaction({
  id,
  userId,
}: Pick<Transaction, "id"> & {
  userId: User["id"];
}) {
  return prisma.transaction.findFirst({
    where: { id, userId },
  });
}

export function getTransactionListItems({ userId }: { userId: User["id"] }) {
  return prisma.transaction.findMany({
    where: { userId },
    select: { id: true, code: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createTransaction({
  type,
  code,
  name,
  date,
  date_start,
  date_end,
  spk_no,
  spk_date,
  bap_no,
  bap_date,
  bast_no,
  bast_date,
  spp_no,
  spp_date,
  duration,
  supplierId,
  userId,
}: Pick<Transaction,
  "type" |
  "code" |
  "name" |
  "date" |
  "date_start" |
  "date_end" |
  "spk_no" |
  "spk_date" |
  "bap_no" |
  "bap_date" |
  "bast_no" |
  "bast_date" |
  "spp_no" |
  "spp_date" |
  "duration"> & {
    supplierId: Supplier["id"];
  } & {
    userId: User["id"];
  }) {
  return prisma.transaction.create({
    data: {
      type,
      code,
      name,
      date,
      date_start,
      date_end,
      spk_no,
      spk_date,
      bap_no,
      bap_date,
      bast_no,
      bast_date,
      spp_no,
      spp_date,
      duration,
      supplier: {
        connect: {
          id: supplierId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteTransaction({
  id,
  userId,
}: Pick<Transaction, "id"> & { userId: User["id"] }) {
  return prisma.transaction.deleteMany({
    where: { id, userId },
  });
}

export function getTransactionCode({
  id
}: Pick<Transaction, "id">) {
  return prisma.transaction.findFirst({
    where: { id },
    select: { code: true },
  });
}
