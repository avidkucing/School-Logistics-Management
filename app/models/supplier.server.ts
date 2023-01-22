import type { User, Supplier } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Supplier } from "@prisma/client";

export function getSupplier({
  id,
  userId,
}: Pick<Supplier, "id"> & {
  userId: User["id"];
}) {
  return prisma.supplier.findFirst({
    where: { id, userId },
  });
}

export function getSupplierListItems({ userId }: { userId: User["id"] }) {
  return prisma.supplier.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createSupplier({
  name,
  leader_name,
  npwp,
  phone,
  address,
  userId,
}: Pick<Supplier,
  "name" |
  "leader_name" |
  "npwp" |
  "phone" |
  "address"> & {
    userId: User["id"];
  }) {
  return prisma.supplier.create({
    data: {
      name,
      leader_name,
      npwp,
      phone,
      address,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteSupplier({
  id,
  userId,
}: Pick<Supplier, "id"> & { userId: User["id"] }) {
  return prisma.supplier.deleteMany({
    where: { id, userId },
  });
}
