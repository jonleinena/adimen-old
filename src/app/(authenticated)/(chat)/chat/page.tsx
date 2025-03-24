import { generateId } from 'ai'

import { Chat } from '@/features/chat/components/chat'
import { getModels } from '@/features/chat/config/models'

export default async function Page() {
  const id = generateId()
  const models = await getModels()
  return <Chat id={id} models={models} />
}