import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateId } from 'ai'

import { Chat } from '@/features/chat/components/chat'
import { getModels } from '@/features/chat/config/models'

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q: string }>
}) {
  noStore()
  const params = await searchParams
  const { q } = params
  
  if (!q) {
    redirect('/')
  }

  const id = generateId()
  const models = await getModels()
  
  return <Chat id={id} query={q} models={models} />
}
