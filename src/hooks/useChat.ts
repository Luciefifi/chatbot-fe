import { useState } from 'react'
import { ChatApiError, streamChat } from '../lib/chatApi'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  error?: boolean
}

// Holds the conversation on screen and sends new messages to the backend.
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)

  async function send(text: string) {
    const message = text.trim()
    if (!message || isStreaming) return

    // Show the student's message and an empty tutor bubble straight away;
    // the tutor bubble fills in as tokens stream in.
    const replyId = crypto.randomUUID()
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: message },
      { id: replyId, role: 'assistant', content: '' },
    ])
    setIsStreaming(true)

    const updateReply = (change: (reply: ChatMessage) => Partial<ChatMessage>) =>
      setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, ...change(m) } : m)))

    try {
      for await (const event of streamChat(message, conversationId)) {
        if (event.type === 'start') {
          setConversationId(event.conversation_id)
        } else if (event.type === 'token') {
          updateReply((reply) => ({ content: reply.content + event.content }))
        } else if (event.type === 'error') {
          updateReply(() => ({ content: event.message, error: true }))
        }
      }
    } catch (e) {
      const text = e instanceof ChatApiError ? e.message : 'Something went wrong. Please try again.'
      updateReply(() => ({ content: text, error: true }))
    } finally {
      setIsStreaming(false)
    }
  }

  function newChat() {
    setMessages([])
    setConversationId(null)
  }

  return { messages, isStreaming, send, newChat }
}
