import Link from 'next/link'
import React from 'react'
import { Users, Hotel, CircleUserRound, ChartLine, Milk, ThermometerSun } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {

    const navList = [
        {
            name: 'Statistic',
            path: '/statistic',
            icon: ChartLine
        },
        {
            name: 'Users',
            path: '/users',
            icon: Users
        },
        {
            name: 'Department',
            path: '/department',
            icon: Hotel
        },
        {
            name: 'Minerals',
            path: '/department',
            icon: Milk
        },
        {
            name: 'Daily Temperature',
            path: '/daily-temperature',
            icon: ThermometerSun
        },
    ]

    return (
        <>
            <aside className='w-64 h-screen bg-white fixed top-0 p-4 left-0'>
                <div className=''>
                    <h2 className='text-xl'>Thesis Name</h2>
                </div>
                <ul className='my-6'>
                    {navList.map((d, i) => (
                        <li>
                            <Link href={d.path} className='flex gap-2 items-center rounded-lg hover:bg-teal-800/10 p-3 px-4 text-gray-600'>
                                <d.icon size={20} />
                                {d.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className='absolute w-full py-2 px-3 bg-teal-800/20 bottom-0 left-0'>
                    <div className='flex cursor-pointer hover:bg-teal-800/20 rounded-lg items-center gap-2 p-1 px-3'>
                        <CircleUserRound className='text-gray-600' size={30} />
                        <div className=''>
                            <h5 className='-mb-1'>Test Admin</h5>
                            <p className='-mt-1 text-gray-500 font-light'>user@test.com</p>
                        </div>
                    </div>
                </div>
            </aside>
            <main className='pl-64 bg-gray-100 min-h-screen'>
                { children }
            </main>
        </>
    )
}
