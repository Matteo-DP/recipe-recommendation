import React, { useRef, useState } from 'react'
import Form from 'react-bootstrap/Form';
import Link from 'next/link';
import styles from "../../styles/main.module.css"
import { useAuth } from '../../src/contexts/AuthContext';
import { useRouter } from 'next/router';

export default function Login() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setError("")
        try {
            await login(emailRef.current.value, passwordRef.current.value)
            router.push("/")
            setLoading(false)
        } catch {
            setError("Invalid email or password")
        }
        setLoading(false)
    }

    return (
        <main className='h-screen'>
            <div className='max-w-[512px] w-full p-8 rounded-xl border shadow-xl absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]'>
                {error && 
                    <p className='px-4 py-2 bg-red-400 text-white text-lg absolute -top-5 left-[50%] -translate-x-[50%] rounded-xl'>{error}</p>
                }
                <h1 className='text-2xl mb-1'>Login</h1>
                <p className='mb-4 text-textlighter'>Please login to continue</p>
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="email@example.com" ref={emailRef} required />
                    </Form.Group>
                    <Form.Group className="mt-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" ref={passwordRef} required />
                    </Form.Group>
                    <div className='flex flex-row justify-around items-baseline'>
                    <button disabled={loading} type="submit" className={`mt-6 bg-accent px-4 py-2 rounded-xl hover:text-accent text-white hover:bg-white duration-75 ${styles.innerShadow}`}>
                        Login
                    </button>
                        <p className='inline-block text-textlighter'>or</p>
                        <Link href="/auth/signup" className='inline-block text-lg text-accent underline hover:text-blue-400'>
                            create an account
                        </Link>
                    </div>
                </Form>
            </div>
        </main>
    )
    }
