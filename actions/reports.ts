"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/password";
import { revalidatePath } from "next/cache";
import { Niramit } from "next/font/google";

export const getPotable = async () => {
  return await prisma.portableConsumes.findMany({
    include: {
      Department: true,
    },
  });
};

export const getConsumedMinerals = async (
  departmentId: number,
  date: any | undefined
) => {
  const whereClause: any = {
    departmentId: Number(departmentId) || undefined,
  };

  // Add date filtering if date range is defined
  if (date) {
    whereClause.createdAt = {
      gte: date.from,
      lte: date.to,
    };
  }

  const consumes = await prisma.consumes.findMany({
    orderBy: { id: "desc" },
    where: whereClause,
    include: {
      Department: {
        select: {
          name: true,
          information: true,
        },
      },
    },
  });

  let totalConsumedAllDepartments = 0;

  // Explicitly type the accumulator object for departmentId
  const result = consumes.reduce<
    Record<
      number,
      {
        departmentId: number;
        totalConsumed: number;
        name: string;
        information: string;
      }
    >
  >((acc, curr) => {
    if (!acc[curr.departmentId]) {
      acc[curr.departmentId] = {
        departmentId: curr.departmentId,
        name: curr.Department.name,
        information: curr.Department.information as string, // Assuming this is a string
        totalConsumed: 0,
      };
    }

    const currentConsumed = curr.totalConsumed ?? 0;
    acc[curr.departmentId].totalConsumed += currentConsumed;

    totalConsumedAllDepartments += currentConsumed;

    return acc;
  }, {});

  // Convert to array and sort by totalConsumed in descending order
  const combinedConsumption = Object.values(result).sort(
    (a, b) => b.totalConsumed - a.totalConsumed
  );

  return { combinedConsumption, totalConsumedAllDepartments };
};

export const getTemperature = async () => {
  return await prisma.temperatures.findMany({
    orderBy: { createdAt: "desc" },
    take: 7,
  });
};

export const getConsumedMineralsByDeparment = async (
  departmentId: number,
  date: any | undefined // Specify the type for date
) => {
  const whereClause: any = {
    departmentId: Number(departmentId) || undefined,
    totalConsumed: {
      not: {
        equals: 0,
      },
    },
  };

  // Add date filtering if date range is defined
  if (date) {
    whereClause.createdAt = {
      gte: date.from,
      lte: date.to,
    };
  }

  return await prisma.consumes.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      Department: {
        select: {
          name: true,
          information: true,
        },
      },
    },
  });
};

export const getConsumedAndTemperature = async (
  departmentId: number,
  date: any | undefined // Assuming you have a type for the date range
) => {
  try {
    const consumedData = await prisma.consumes.findMany({
      where: {
        departmentId: Number(departmentId) || undefined,
        // Filter by createdAt date range if date is defined
        ...(date && {
          createdAt: {
            gte: date.from, // Start of the date range
            lte: date.to, // End of the date range
          },
        }),
      },
      include: {
        Temperature: true, // Include temperature data
      },
    });

    return consumedData; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching consumed data and temperature:", error);
    throw new Error("Failed to fetch consumed data and temperature");
  }
};
