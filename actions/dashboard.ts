"use server";

import { prisma } from "@/lib/prisma";
import { startOfToday, endOfToday } from "date-fns";

export const getDashboardData = async () => {
  const [
    mineralCount,
    userCount,
    departmentCount,
    totalConsumedToday,
    totalConsumedAllTime,
  ] = await Promise.all([
    prisma.minerals.count({
      orderBy: { id: "desc" },
    }),
    prisma.users.count({
      where: {
        userType: "USER",
      },
      orderBy: { id: "desc" },
    }),
    prisma.departments.count({
      orderBy: { id: "desc" },
    }),
    prisma.consumes.aggregate({
      _sum: {
        totalConsumed: true,
      },
      where: {
        createdAt: {
          gte: startOfToday(),
          lte: endOfToday(),
        },
      },
    }),
    prisma.consumes.aggregate({
      _sum: {
        totalConsumed: true,
      },
    }),
  ]);

  return {
    mineralCount,
    userCount,
    departmentCount,
    totalConsumedToday: totalConsumedToday._sum.totalConsumed || 0, // Return 0 if null
    totalConsumedAllTime: totalConsumedAllTime._sum.totalConsumed || 0, // Return 0 if null
  };
};
