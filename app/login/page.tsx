"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'

export default function LoginPage() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const handleLogin = async () => {
        setLoading(true)

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({email, password})
        })
        const data = await res.json()
        console.log('====================================');
        console.log(data);
        console.log('====================================');
    }

    return (
        <main className='w-full h-screen flex justify-center items-center'>
            <div className='space-y-3 w-80 px-4'>
                <h3 className='text-2xl font-medium'>Login</h3>
                <div>
                    <p>Email</p>
                    <Input onChange={(e) => setEmail(e.target.value)} placeholder='Type your email' />
                </div>
                <div>
                    <p>Password</p>
                    <Input onChange={(e) => setPassword(e.target.value)} placeholder='Type your password' type='password' />
                </div>
                <div className='pt-2'>
                    <Button disabled={loading} onClick={handleLogin} className='w-full'>Login</Button>
                </div>
            </div>
        </main>
    )
}
