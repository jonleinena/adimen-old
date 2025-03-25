import { notFound, redirect } from 'next/navigation'

import { getUser } from '@/features/account/controllers/get-user'
import { getChat } from '@/features/chat/actions/chat'
import { Chat } from '@/features/chat/components/chat'
import { getModels } from '@/features/chat/config/models'
import { convertToUIMessages } from '@/features/chat/utils'
export const maxDuration = 60

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params

  const user = await getUser()
  const chat = await getChat(id, user?.id)
  return {
    title: chat?.title.toString().slice(0, 50) || 'Search'
  }
}

export default async function SearchPage(props: {
  params: Promise<{ id: string }>
}) {

  const user = await getUser()
  const userId = user?.id
  const { id } = await props.params

  const chat = await getChat(id, userId)
  // convertToUIMessages for useChat hook
  const messages = convertToUIMessages(chat?.messages || [])

  if (!chat) {
    redirect('/')
  }

  if (chat?.userId !== userId && chat?.userId !== 'anonymous') {
    notFound()
  }

  const models = await getModels()
  return <Chat id={id} savedMessages={messages} models={models} />
}
