import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../src/contexts/AuthContext';

export default function Logout() {

    const [text, setText] = useState("Redirecting...");
    const { logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        logout()
            .then(() => router.push("/"))
            .catch(() => setText("Failed to logout"))
    })

    return (
        <p className='text-xl'>{text}</p>
    )
}
