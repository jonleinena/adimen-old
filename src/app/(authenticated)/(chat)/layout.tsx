import { Inter as FontSans } from 'next/font/google'
import { redirect } from 'next/navigation'

import { Toaster } from '@/components/ui/sonner'
import { getSession } from '@/features/account/controllers/get-session'
import Footer from '@/features/chat/components/footer'
import Header from '@/features/chat/components/header'
import { ThemeProvider } from '@/features/chat/components/theme-provider'
import { cn } from '@/utils/cn'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export default async function ChatLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // Additional layer of protection in case middleware fails
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

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
