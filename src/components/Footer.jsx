import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <div className='mt-16 p-8 bg-bglight h-48'>
        <h1 className='mb-2'>Resources</h1>
        <ul className='text-sm'>
            <li>
                <Link href="/">
                    Whats in your fridge?
                </Link>
            </li>
            <li>
                <Link href="/">
                    Home
                </Link>
            </li>
            <li>
                <Link href="/auth/login">
                    Login
                </Link>
            </li>
        </ul>
        <p className="text-center text-textlighter">
            <i className="fa-regular fa-copyright mr-2"></i>
            Matteo De Pauw 2023
        </p>
    </div>
  )
}
