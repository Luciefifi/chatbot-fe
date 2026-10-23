import Markdown from 'react-markdown'
import type { ChatMessage } from '../hooks/useChat'

type Props = {
  message: ChatMessage
}

export function MessageBubble({ message }: Props) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2.5 whitespace-pre-wrap text-white">
          {message.content}
        </div>
      </div>
    )
  }

  if (message.error) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-red-200 bg-red-50 px-4 py-2.5 text-red-700">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-2.5 text-slate-800 shadow-sm">
        {message.content ? (
          <div className="space-y-2 leading-relaxed [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:overflow-x-auto [&_ul]:list-disc [&_ul]:pl-5">
            <Markdown>{message.content}</Markdown>
          </div>
        ) : (
          <TypingDots />
        )}
      </div>
    </div>
  )
}

// Shown while the tutor's reply is still empty, before the first token arrives.
function TypingDots() {
  return (
    <div className="flex gap-1 py-2" aria-label="Tutor is typing">
      <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
      <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
      <span className="size-2 animate-bounce rounded-full bg-slate-400" />
    </div>
  )
}
