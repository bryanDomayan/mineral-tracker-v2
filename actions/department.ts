"use server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

interface DepartmentTypes {
    name: string,
    information?: string,
    logoPath?: string
}

export const get = async () => {
    return await prisma.departments.findMany({
        orderBy: { id: "desc" }
    })
}

export const create = async (payload: DepartmentTypes, path?: string) => {
    try {
        const data = await prisma.departments.create({
            data: payload
        })
    
        if (path) revalidatePath(path)
    
        return data
    } catch (error) {
        return error
    }
}