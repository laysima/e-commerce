import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Cressida — Modern E-Commerce',
    template: '%s | Cressida',  // e.g. "Wireless Headphones | Cressida"
  },
  description: 'Discover thousands of products across every category.',
  keywords: ['ecommerce', 'shop', 'online store', 'shopping'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Cressida',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}