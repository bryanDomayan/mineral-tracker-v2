"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface DepartmentTypes {
  name: string;
  information?: string;
  logoPath?: string;
}

interface DepartmentId {
  id: number;
}

// Fetch all departments
export const get = async () => {
  return await prisma.departments.findMany({
    orderBy: { id: "desc" },
  });
};

// Create a new department
export const create = async (payload: DepartmentTypes, path?: string) => {
  try {
    const data = await prisma.departments.create({
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
  payload: DepartmentTypes,
  path?: string
) => {
  try {
    const data = await prisma.departments.update({
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
export const deleteDepartment = async (id: DepartmentId, path?: string) => {
  try {
    const data = await prisma.departments.delete({
      where: { id: id.id },
    });

    if (path) revalidatePath(path);

    return data;
  } catch (error) {
    return error;
  }
};
