import { unstable_noStore as noStore } from 'next/cache'
import { generateId } from 'ai'

import { Chat } from '@/features/chat/components/chat'
import { getModels } from '@/features/chat/config/models'

// Force dynamic behavior for this route
export const dynamic = 'force-dynamic'

export default async function Page() {
  // Prevent caching of this route
  noStore()

  const id = generateId()
  const models = await getModels()
  return <Chat id={id} models={models} />
}