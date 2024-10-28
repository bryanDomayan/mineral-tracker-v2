"use server";
import { Minerals, prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface createMineralTypes {
  userId?: number;
  name: string;
  brand?: string;
  description?: string;
  size?: string;
}

interface menaralId {
  id: number;
}

// Fetch all departments
export const getMineral = async () => {
  return await prisma.minerals.findMany({
    orderBy: { id: "desc" },
  });
};

// Create a new department
export const create = async (payload: createMineralTypes, path?: string) => {
  try {
    const data = await prisma.minerals.create({
      data: payload,
    });

    if (path) revalidatePath(path);

    return data;
  } catch (error) {
    return error;
  }
};

// Update an existing department
export const update = async (
  id: number,
  payload: createMineralTypes,
  path?: string
) => {
  try {
    const data = await prisma.minerals.update({
      where: { id },
      data: payload,
    });

    if (path) revalidatePath(path);

    return data;
  } catch (error) {
    return error;
  }
};

// Delete a department
export const deleteDepartment = async (id: menaralId, path?: string) => {
  try {
    const data = await prisma.minerals.delete({
      where: { id: id.id },
    });

    if (path) revalidatePath(path);

    return data;
  } catch (error) {
    return error;
  }
};

export const getMineralStockOfDepartment = async (departmentId: number) => {
  return await prisma.users.findFirst({
    where: {
      departmentId: departmentId,
    },
    select: {
      departmentId: true,
      Stocks: {
        include: {
          Mineral: true,
        },
      },
    },
    orderBy: { id: "desc" },
  });
};

export const getSuggestion = async () => {
  return await prisma.suggestions.findMany({
    orderBy: { id: "desc" },
    include: {
      User: {
        select: {
          firstName: true,
          Department: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};
export const updateSuggestionStatus = async (id: string, approve: boolean) => {
  return await prisma.suggestions.update({
    where: { id: Number(id) },
    data: { approve },
  });
};
