"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/password";
import { revalidatePath } from "next/cache";

interface userId {
  id: number;
}
export const getUsers = async () => {
  return await prisma.users.findMany({
    where: {
      userType: {
        not: "ADMIN",
      },
    },
    orderBy: { id: "desc" },
    include: {
      Department: true,
    },
  });
};

enum UserType {
  ADMIN = "ADMIN",
  USER = "USER",
}

interface userType {
  firstName?: string;
  lastName: string;
  email: string;
  userType: UserType;
  password: string;
  departmentId?: number;
}

export const deleteDepartment = async (id: userId, path?: string) => {
  try {
    const data = await prisma.users.delete({
      where: { id: id.id },
    });

    if (path) revalidatePath(path);

    return data;
  } catch (error) {
    return error;
  }
};

export const create = async (payload: userType, path?: string) => {
  try {
    const password = await hashPassword(payload.password as string);
    payload.password = password;
    const data = await prisma.users.create({
      data: payload,
    });

    if (path) revalidatePath(path);

    return data;
  } catch (error) {
    return error;
  }
};

export const update = async (id: number, payload: userType, path?: string) => {
  try {
    if (payload.password) {
      const password = await hashPassword(payload.password as string);
      payload.password = password;
    }
    
    const data = await prisma.users.update({
      where: { id: Number(id) },
      data: payload,
    });

    if (path) revalidatePath(path);

    return data;
  } catch (error) {
    return error;
  }
};
export const getDepartmentOption = async () => {
  return await prisma.departments.findMany({
    orderBy: { id: "desc" },
  });
};
