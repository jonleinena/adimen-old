import { notFound, redirect } from 'next/navigation'

import { getSession } from '@/features/account/controllers/get-session'
import { getChat } from '@/features/chat/actions/chat'
import { Chat } from '@/features/chat/components/chat'
import { getModels } from '@/features/chat/config/models'
import { convertToUIMessages } from '@/features/chat/utils'
export const maxDuration = 60

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const session = await getSession()
  const chat = await getChat(id, session?.user.id || 'anonymous')
  return {
    title: chat?.title.toString().slice(0, 50) || 'Search'
  }
}

export default async function SearchPage(props: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  const userId = session?.user.id || 'anonymous'
  const { id } = await props.params

  const chat = await getChat(id, userId)
  // convertToUIMessages for useChat hook
  const messages = convertToUIMessages(chat?.messages || [])

  if (!chat) {
    redirect('/')
  }

  if (chat?.userId !== userId) {
    notFound()
  }

  const models = await getModels()
  return <Chat id={id} savedMessages={messages} models={models} />
}
