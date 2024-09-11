"use client"
import { trpc } from '@/app/_trpc/client'
import React from 'react'

export default function Users() {
    const users = trpc.users.getUsers.useQuery()
    return (
        <div>
            <h1>Users:</h1>
            <p>{JSON.stringify(users.data)}</p>
        </div>
    )
}
