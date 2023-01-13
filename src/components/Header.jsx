import React from 'react'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {

    const { currentUser } = useAuth()

    return (
        <nav className='p-4 sticky z-[99] top-0 right-0 bg-white text-black shadow-md'>
            <ul className='flex flex-row gap-4 justify-between items-baseline flex-nowrap'>
                <div>
                    <li className='mr-4 font-medium hidden sm:inline text-xl text-accent'>
                        <Link href="/">
                            Whats in your fridge?
                        </Link>
                    </li>
                    <li className='inline hover:text-accent duration-75 ease-in'>
                        <Link href="/">
                            Home
                        </Link>
                    </li>
                </div>
                <li className="hover:text-accent duration-75 ease-in">
                    {currentUser && <p className='mr-4 text-textlighter inline'>{currentUser.email}</p>}
                    {currentUser ?
                        <Link href="/auth/logout">
                            Logout
                        </Link>
                    :
                        <Link href="/auth/login">
                            Login
                        </Link>
                    }
                </li>
            </ul>
        </nav>
    )
}
