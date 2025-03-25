import React from 'react'

import { getUser } from '@/features/account/controllers/get-user'

import { History } from './history'
import { HistoryList } from './history-list'
const HistoryContainer: React.FC = async () => {
  const enableSaveChatHistory = process.env.ENABLE_SAVE_CHAT_HISTORY === 'true'
  if (!enableSaveChatHistory) {
    return null
  }

  const user = await getUser()
  const userId = user?.id || 'anonymous'

  return (
    <div>
      <History>
        <HistoryList userId={userId} />
      </History>
    </div>
  )
}

export default HistoryContainer
