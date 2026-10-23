import { useChat } from '../hooks/useChat'
import { useHealth, type HealthState } from '../hooks/useHealth'
import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'

// The complete chat: header, messages and input. It fills whatever box it is
// placed in, so other apps can drop <ChatWindow /> into their own layout.
export function ChatWindow() {
  const { messages, isStreaming, send, newChat } = useChat()
  const health = useHealth()

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <h1 className="font-semibold text-slate-900">Study Tutor</h1>
          <StatusLine health={health} />
        </div>
        <button
          onClick={newChat}
          disabled={isStreaming || messages.length === 0}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          New chat
        </button>
      </header>

      <MessageList messages={messages} onSuggestion={send} />
      <ChatInput disabled={isStreaming} onSend={send} />
    </div>
  )
}

function StatusLine({ health }: { health: HealthState }) {
  let dot = 'bg-slate-400'
  let text = 'Connecting…'
  if (health.status === 'online') {
    dot = 'bg-green-500'
    text = `Online · ${health.model}`
  } else if (health.status === 'offline') {
    dot = 'bg-red-500'
    text = 'Offline: start the backend server'
  }

  return (
    <p className="flex items-center gap-1.5 text-xs text-slate-500">
      <span className={`size-2 rounded-full ${dot}`} />
      {text}
    </p>
  )
}
