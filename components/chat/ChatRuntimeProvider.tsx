'use client'

import { useState } from 'react'
import { AssistantRuntimeProvider } from '@assistant-ui/react'
import { AssistantChatTransport, useChatRuntime } from '@assistant-ui/react-ai-sdk'
import type { UIMessage } from 'ai'

export function ChatRuntimeProvider({
  initialMessages,
  children,
}: {
  initialMessages: UIMessage[]
  children: React.ReactNode
}) {
  const [transport] = useState(() => new AssistantChatTransport({ api: '/api/chat' }))
  const runtime = useChatRuntime({ transport, messages: initialMessages })
  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>
}
