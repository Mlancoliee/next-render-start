import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '全栈部署 - EdgeOne Pages',
  description: 'Created with EdgeOne Pages',
  generator: 'edgeone.ai',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
