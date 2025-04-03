import { unstable_noStore as noStore } from 'next/cache'
import { Inter as FontSans } from 'next/font/google'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { getSession } from '@/features/account/controllers/get-session'
import { cn } from '@/utils/cn'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

export const dynamic = 'force-dynamic'

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

  noStore()

  return (
    <div className={cn('font-sans antialiased', fontSans.variable)}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <main>
          {children}
        </main>
        <Toaster />
      </ThemeProvider>
    </div>
  )
}
