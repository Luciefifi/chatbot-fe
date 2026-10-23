import { useState, type FormEvent, type KeyboardEvent } from 'react'

type Props = {
  disabled: boolean
  onSend: (text: string) => void
}

export function ChatInput({ disabled, onSend }: Props) {
  const [text, setText] = useState('')

  function submit(e?: FormEvent) {
    e?.preventDefault()
    if (disabled || !text.trim()) return
    onSend(text)
    setText('')
  }

  // Enter sends; Shift+Enter adds a new line.
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form onSubmit={submit} className="flex items-end gap-2 border-t border-slate-200 bg-white p-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask your tutor anything…"
        rows={1}
        className="field-sizing-content max-h-40 min-h-11 flex-1 resize-none rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="h-11 rounded-xl bg-blue-600 px-5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Send
      </button>
    </form>
  )
}
