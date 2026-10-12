// AI-Contract-Assistant-Frontend/src/services/chatService.ts
import { apiFetch } from '@/lib/api'

import type { ChatMessage, Citation } from '@/types'

interface BackendSource {
  chunk_id: number
  page_number: number | null
  chunk_index: number
  chunk_text: string
}

interface BackendAnswer {
  answer: string
  sources: BackendSource[]
}

function mapSourceToCitation(
  source: BackendSource,
  index: number,
): Citation {
  return {
    id: `citation-${source.chunk_id}-${index}`,
    page: source.page_number ?? 0,
    section: `Page ${source.page_number ?? 'Unknown'} — Chunk ${source.chunk_index + 1}`,
    excerpt: source.chunk_text,
  }
}

export const chatService = {
  async getConversation(
    _documentId: string,
  ): Promise<ChatMessage[]> {
    // Conversation persistence is not implemented yet.
    return []
  },

  async sendMessage(
    documentId: string,
    _documentName: string,
    question: string,
  ): Promise<ChatMessage> {
    const response = await apiFetch<BackendAnswer>(
      `/documents/${documentId}/ask?question=${encodeURIComponent(question)}`,
      {
        method: 'POST',
      },
    )

    const citations = response.sources.map(
      mapSourceToCitation,
    )

    return {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: response.answer,
      citations,
      createdAt: new Date().toISOString(),
    }
  },
}