import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Testimonial Wall — 顧客レビュー収集・表示OSS',
  description:
    '顧客の声を収集して、そのままサイトに表示する。Senja / Testimonial.to のオープンソース代替。Next.js 15 + Supabase。',
  openGraph: {
    title: 'Testimonial Wall',
    description: '顧客レビュー収集・表示OSS。Senjaの無料代替。',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
