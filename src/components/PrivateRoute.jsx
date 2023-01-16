import { useRouter } from 'next/router';
import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children }) {

    const { currentUser } = useAuth();
    const router = useRouter();

    if(!currentUser) return router.push("/auth/login")

    return(
        children
    )
}
