import { apiFetch } from '@/lib/api'

import type {
  ContractDocument,
  SummaryField,
  RecentQuestion,
} from '@/types'

interface BackendDocument {
  id: number
  filename: string
  file_size: number
  status: 'uploaded' | 'processing' | 'ready' | 'failed'
  created_at: string
  updated_at: string
  pages_count: number
  chunks_count: number
}

function mapDocument(doc: BackendDocument): ContractDocument {
  return {
    id: String(doc.id),
    name: doc.filename,
    status: doc.status,
    pages: doc.pages_count,
    chunks: doc.chunks_count,
    sizeBytes: doc.file_size,
    uploadedAt: doc.created_at,
    contractType: 'PDF',
    questionCount: 0,
  }
}

export const documentService = {
  async list(): Promise<ContractDocument[]> {
    const response = await apiFetch<BackendDocument[]>('/documents')

    return response.map(mapDocument)
  },

  async getById(id: string): Promise<ContractDocument | undefined> {
    try {
      const response = await apiFetch<BackendDocument>(
        `/documents/${id}`,
      )

      return mapDocument(response)
    } catch {
      return undefined
    }
  },

  async upload(file: File): Promise<ContractDocument> {
    const formData = new FormData()

    formData.append('file', file)

    const response = await apiFetch<BackendDocument>(
      '/documents/upload',
      {
        method: 'POST',
        body: formData,
      },
    )

    return mapDocument(response)
  },

  async delete(id: string): Promise<void> {
    await apiFetch(`/documents/${id}`, {
      method: 'DELETE',
    })
  },

  async getFileUrl(id: string): Promise<string> {
    const baseUrl =
      import.meta.env.VITE_API_URL || 'http://localhost:8000'

    return `${baseUrl}/documents/${id}/file`
  },

  async getSummary(id: string): Promise<SummaryField[]> {
  const document = await this.getById(id)

  if (!document) {
    return []
  }

  return [
    {
      label: 'File type',
      value: document.contractType,
      icon: 'FileText',
    },
    {
      label: 'File size',
      value: `${(document.sizeBytes / 1024 / 1024).toFixed(2)} MB`,
      icon: 'HardDrive',
    },
    {
      label: 'Pages',
      value: String(document.pages),
      icon: 'FileStack',
    },
    {
      label: 'Chunks',
      value: String(document.chunks),
      icon: 'Layers',
    },
  ]
},

  async getRecentQuestions(
    _id: string,
  ): Promise<RecentQuestion[]> {
    return []
  },
}