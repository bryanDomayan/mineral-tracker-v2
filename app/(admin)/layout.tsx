import Sidebar from '@/components/Sidebar'
import React from 'react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <Sidebar />
            <main className='pl-64 bg-gray-100 min-h-screen'>
                { children }
            </main>
        </>
    )
}
