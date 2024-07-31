import React from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <aside>
                <h1>This is admin</h1>
            </aside>
            <main>
                { children }
            </main>
        </>
    )
}
