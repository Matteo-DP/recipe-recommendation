import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import Script from 'next/script'
import Footer from '../src/components/Footer'
import Header from '../src/components/Header'
import Head from 'next/head'
import { AuthProvider } from '../src/contexts/AuthContext'
import { Analytics } from '@vercel/analytics/react'

function MyApp({ Component, pageProps }) {
  return( 
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <title>What&apos;s in your fridge?</title>
      </Head>
      <Script src='https://kit.fontawesome.com/2ad3ea3c29.js' crossOrigin='anonymous'></Script>
      <AuthProvider>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
      <Analytics />
    </>
  )
}

export default MyApp
