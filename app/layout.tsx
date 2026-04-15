import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToastContainer } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'EkkoShop — Premium Tech Store',
  description: 'Discover premium electronics and tech accessories',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-dark antialiased">
        <Providers>
          <Header />
          {children}
          <Footer />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  )
}
