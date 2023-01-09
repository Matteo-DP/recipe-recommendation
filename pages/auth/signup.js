import React, { useRef, useState } from 'react'
import Form from 'react-bootstrap/Form';
import Link from 'next/link';
import styles from "../../styles/main.module.css"
import { useAuth } from '../../src/contexts/AuthContext';
import { useRouter } from 'next/router';

export default function signup() {

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setError("")
        if(passwordConfirmRef.current.value !== passwordRef.current.value) {
            setError("Passwords don't match")
            setLoading(false)
            return
        }
        try {
            await signup(emailRef.current.value, passwordRef.current.value)
            router.push("/")
            setLoading(false)
        } catch {
            setError("An error occured while creating your account.")
        }
        setLoading(false)
    }

  return (
    <main className='h-screen'>
    <div className='max-w-[512px] w-full p-8 rounded-xl border shadow-xl absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]'>
        {error && 
            <p className='px-4 py-2 bg-red-400 text-white text-lg absolute -top-5 left-[50%] -translate-x-[50%] rounded-xl'>{error}</p>
        }
        <h1 className='text-2xl mb-1'>Signup</h1>
        <p className='mb-4 text-textlighter'>Please create a free account to access all of our features</p>
        <Form onSubmit={(e) => handleSubmit(e)}>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="email@example.com" ref={emailRef} required />
            </Form.Group>
            <Form.Group className="mt-2">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Minimum 6 characters" ref={passwordRef} required />
            </Form.Group>
            <Form.Group className="mt-2">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control type="password" placeholder="Confirm password" ref={passwordConfirmRef} required />
            </Form.Group>
            <div className='flex flex-row justify-around items-baseline flex-wrap gap-4'>
                <button disabled={loading} type="submit" className={`mt-6 bg-accent px-4 py-2 rounded-xl hover:text-accent text-white hover:bg-white duration-75 ${styles.innerShadow}`}>
                    Register
                </button>
                <div>
                    <p className='inline-block text-textlighter mr-2'>already have an account?</p>
                    <Link href="/auth/login" className='inline-block text-lg text-accent underline hover:text-blue-400'>
                        login
                    </Link>
                </div>
            </div>
        </Form>
    </div>
</main>
  )
}
