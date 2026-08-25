import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Cressida — A Considered Wardrobe',
    template: '%s | Cressida',
  },
  description: 'Contemporary clothing and footwear selected for texture, proportion, and permanence.',
  keywords: ['contemporary clothing', 'footwear', 'apparel', 'Cressida'],
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
