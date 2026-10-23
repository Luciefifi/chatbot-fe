import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../hooks/useChat'
import { MessageBubble } from './MessageBubble'

const SUGGESTIONS = [
  'Explain photosynthesis simply',
  'Quiz me on the water cycle',
  'What is a variable in programming?',
]

type Props = {
  messages: ChatMessage[]
  onSuggestion: (text: string) => void
}

export function MessageList({ messages, onSuggestion }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Keep the newest text in view as messages and streamed tokens arrive.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">What would you like to learn today?</h2>
          <p className="mt-1 text-slate-500">Ask a question, or pick one to get started.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((text) => (
            <button
              key={text}
              onClick={() => onSuggestion(text)}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-blue-400 hover:text-blue-700"
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
