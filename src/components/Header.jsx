import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <nav className='p-4 sticky z-[99] top-0 right-0 bg-white text-black'>
        <ul className='flex flex-row gap-4 justify-between'>
            <div>
                <li className='inline mr-4 font-medium text-xl text-accent'>
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
                <Link href="/auth/login">
                    Login
                </Link>
            </li>
        </ul>
    </nav>
  )
}
