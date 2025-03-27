import { Inter as FontSans } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'
import Footer from '@/features/chat/components/footer'
import Header from '@/features/chat/components/header'
import { ThemeProvider } from '@/features/chat/components/theme-provider'
import { cn } from '@/utils/cn'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export default function ChatLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={cn('font-sans antialiased', fontSans.variable)}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Header />
        <main>
          {children}
        </main>
        <Footer />
        <Toaster />
      </ThemeProvider>
    </div>
  )
}
