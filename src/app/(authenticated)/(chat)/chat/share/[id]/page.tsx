import { notFound } from 'next/navigation'

import { getSharedChat } from '@/features/chat/actions/chat'
import { Chat } from '@/features/chat/components/chat'
import { getModels } from '@/features/chat/config/models'
import { convertToUIMessages } from '@/features/chat/utils'

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const chat = await getSharedChat(id)

  if (!chat || !chat.sharePath) {
    return notFound()
  }

  return {
    title: chat?.title.toString().slice(0, 50) || 'Search'
  }
}

export default async function SharePage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const chat = await getSharedChat(id)

  if (!chat || !chat.sharePath) {
    return notFound()
  }

  const models = await getModels()
  return (
    <Chat
      id={chat.id}
      savedMessages={convertToUIMessages(chat.messages)}
      models={models}
    />
  )
}
