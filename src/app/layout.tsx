import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer, toast } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';
import "./scss/main.scss";
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Upfilly',
  description: 'Generated by Upfilly',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body className={inter.className} >
      {/* <script src="assets/js/setcookies.js"/> */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" />
        <GoogleOAuthProvider clientId="817638365394-413bppqmd901dl9u6ml6na7an7f02r9s.apps.googleusercontent.com">
          {children}</GoogleOAuthProvider>
        <div id="loader" className="loaderDiv d-none">
          <div>
            <img src="/assets/img/loader.gif" alt="logo" className="loaderlogo" />
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={500} hideProgressBar />
      </body>
    </html>
  )
}
