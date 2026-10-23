// Everything that talks to the chatbot backend lives here.
// Components never call fetch() directly, so the backend's address and
// response formats are known in this one file only.

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// The events sent by POST /chat/stream, one JSON object per line.
export type ChatEvent =
  | { type: 'start'; conversation_id: string }
  | { type: 'token'; content: string }
  | { type: 'done' }
  | { type: 'error'; message: string }

export type Health = { status: string; model: string }

export class ChatApiError extends Error {}

export async function getHealth(): Promise<Health> {
  const response = await request('/health')
  return response.json()
}

// Sends one message and yields the reply's events as they arrive.
export async function* streamChat(
  message: string,
  conversationId: string | null,
): AsyncGenerator<ChatEvent> {
  const response = await request('/chat/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversation_id: conversationId }),
  })
  if (!response.body) throw new ChatApiError('The server sent an empty response.')

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    // A chunk can end in the middle of a line, so keep the unfinished
    // last part in the buffer until the rest of it arrives.
    buffer += value
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (line.trim()) yield JSON.parse(line) as ChatEvent
    }
  }

  if (buffer.trim()) yield JSON.parse(buffer) as ChatEvent
}

// fetch() with readable errors: network failures and 4xx/5xx responses
// both become a ChatApiError with a message a person can understand.
async function request(path: string, init?: RequestInit): Promise<Response> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, init)
  } catch {
    throw new ChatApiError("Can't reach the chatbot server. Is the backend running?")
  }

  if (!response.ok) {
    throw new ChatApiError(await errorDetail(response))
  }
  return response
}

async function errorDetail(response: Response): Promise<string> {
  try {
    const body = await response.json()
    if (typeof body.detail === 'string') return body.detail
  } catch {
    // The body wasn't JSON; fall through to the generic message.
  }
  return `The server returned an error (${response.status}).`
}
