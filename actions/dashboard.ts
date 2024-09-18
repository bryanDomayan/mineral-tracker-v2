"use server";

import { prisma } from "@/lib/prisma";

export const getMineralCount = async () => {
  return await prisma.minerals.count({
    orderBy: { id: "desc" },
  });
};

export const getUserCount = async () => {
  return await prisma.minerals.count({
    orderBy: { id: "desc" },
  });
};

export const getDepartmentCount = async () => {
  return await prisma.minerals.count({
    orderBy: { id: "desc" },
  });
};
