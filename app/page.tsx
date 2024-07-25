import Users from "@/components/Users";
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default function Home() {
    redirect('/login')
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {/* <Button>Click me</Button> */}
            <Link href="/login">Login</Link>
            <Users />
        </main>
    );
}
