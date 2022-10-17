import type { User, School } from "@prisma/client";

import { prisma } from "~/db.server";

export type { School } from "@prisma/client";

export function getSchool({
  id,
  userId,
}: Pick<School, "id"> & {
  userId: User["id"];
}) {
  return prisma.school.findFirst({
    where: { id, userId },
  });
}

export function getSchoolListItems({ userId }: { userId: User["id"] }) {
  return prisma.school.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createSchool({
  name,
  head_name,
  head_no,
  staff_name,
  staff_no,
  manager_name,
  team_name,
  team_no,
  address,
  userId,
}: Pick<School,
  "name" |
  "head_name" |
  "head_no" |
  "staff_name" |
  "staff_no" |
  "manager_name" |
  "team_name" |
  "team_no" |
  "address"> & {
    userId: User["id"];
  }) {
  return prisma.school.create({
    data: {
      name,
      head_name,
      head_no,
      staff_name,
      staff_no,
      manager_name,
      team_name,
      team_no,
      address,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteSchool({
  id,
  userId,
}: Pick<School, "id"> & { userId: User["id"] }) {
  return prisma.school.deleteMany({
    where: { id, userId },
  });
}
