import type { Metadata } from 'next'
import { Inter, Bodoni_Moda, Pinyon_Script, Montserrat } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const bodoni = Bodoni_Moda({ subsets: ['latin'], variable: '--font-bodoni' })
const pinyon = Pinyon_Script({ weight: '400', subsets: ['latin'], variable: '--font-pinyon' })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })

export const metadata: Metadata = {
  title: 'Jhe & Eifer - Wedding RSVP',
  description: 'Join us in celebrating our special day on December 21, 2025',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${bodoni.variable} ${pinyon.variable} ${montserrat.variable}`}>{children}</body>
    </html>
  )
}
