import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'

import { SidebarToggle } from "@/components/sidebar-toggle"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getSession } from '@/features/account/controllers/get-session'
import { ChatSidebar } from "@/features/chat/components/chat-sidebar"

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


  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-full">
        <ChatSidebar />
        <SidebarToggle />
        <SidebarInset className="flex flex-col w-full">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  )
}
