import React from 'react'

import { getSession } from '@/features/account/controllers/get-session'

import { History } from './history'
import { HistoryList } from './history-list'
const HistoryContainer: React.FC = async () => {
  const enableSaveChatHistory = process.env.ENABLE_SAVE_CHAT_HISTORY === 'true'
  if (!enableSaveChatHistory) {
    return null
  }
  const session = await getSession()
  const userId = session?.user.id || 'anonymous'

  return (
    <div>
      <History>
        <HistoryList userId={userId} />
      </History>
    </div>
  )
}

export default HistoryContainer
