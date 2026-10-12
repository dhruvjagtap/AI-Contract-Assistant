export type DocumentStatus = 'uploaded' | 'uploading' | 'processing' | 'ready' | 'failed'

export interface ContractDocument {
  id: string
  name: string
  status: DocumentStatus
  pages: number
  chunks: number
  sizeBytes: number
  uploadedAt: string
  contractType: string
  processingStep?: ProcessingStepId
  questionCount: number
}

export type ProcessingStepId =
  | 'upload'
  | 'read'
  | 'extract'
  | 'chunk'
  | 'embed'
  | 'index'

export interface ProcessingStep {
  id: ProcessingStepId
  label: string
  status: 'complete' | 'active' | 'pending'
}

export interface Citation {
  id: string
  page: number
  section: string
  excerpt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  createdAt: string
}

export interface Conversation {
  id: string
  documentId: string
  messages: ChatMessage[]
}

export interface SummaryField {
  label: string
  value: string
  icon: string
}

export interface RecentQuestion {
  id: string
  question: string
  askedAt: string
}

export interface User {
  name: string
  email: string
  initials: string
}
