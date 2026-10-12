import type {
  ContractDocument,
  ProcessingStep,
  ChatMessage,
  SummaryField,
  RecentQuestion,
  User,
} from '@/types'

export const currentUser: User = {
  name: 'Dhruv Malhotra',
  email: 'dhruv@ferrocorp.legal',
  initials: 'DM',
}

export const documents: ContractDocument[] = [
  {
    id: 'doc-employment',
    name: 'Employment.pdf',
    status: 'ready',
    pages: 38,
    chunks: 214,
    sizeBytes: 1_240_000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    contractType: 'Employment Agreement',
    questionCount: 12,
  },
  {
    id: 'doc-nda',
    name: 'NDA.pdf',
    status: 'ready',
    pages: 9,
    chunks: 41,
    sizeBytes: 310_000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    contractType: 'Non-Disclosure Agreement',
    questionCount: 4,
  },
  {
    id: 'doc-vendor',
    name: 'Vendor.pdf',
    status: 'ready',
    pages: 22,
    chunks: 132,
    sizeBytes: 780_000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    contractType: 'Vendor Services Agreement',
    questionCount: 7,
  },
  {
    id: 'doc-rental',
    name: 'Rental.pdf',
    status: 'processing',
    pages: 14,
    chunks: 0,
    sizeBytes: 420_000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    contractType: 'Commercial Lease Agreement',
    processingStep: 'chunk',
    questionCount: 0,
  },
  {
    id: 'doc-msa',
    name: 'Master-Services-Agreement.pdf',
    status: 'ready',
    pages: 51,
    chunks: 288,
    sizeBytes: 1_960_000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    contractType: 'Master Services Agreement',
    questionCount: 19,
  },
  {
    id: 'doc-sla',
    name: 'SLA-Addendum.pdf',
    status: 'failed',
    pages: 6,
    chunks: 0,
    sizeBytes: 190_000,
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    contractType: 'Service Level Addendum',
    questionCount: 0,
  },
]

export const processingPipeline: ProcessingStep[] = [
  { id: 'upload', label: 'Upload complete', status: 'complete' },
  { id: 'read', label: 'Reading PDF', status: 'complete' },
  { id: 'extract', label: 'Extracting text', status: 'complete' },
  { id: 'chunk', label: 'Splitting into chunks', status: 'active' },
  { id: 'embed', label: 'Creating embeddings', status: 'pending' },
  { id: 'index', label: 'Indexing', status: 'pending' },
]

export const summaryByDocument: Record<string, SummaryField[]> = {
  'doc-employment': [
    { label: 'Contract Type', value: 'Employment Agreement', icon: 'FileText' },
    { label: 'Notice Period', value: '90 Days', icon: 'CalendarClock' },
    { label: 'Confidentiality', value: 'Present', icon: 'ShieldCheck' },
    { label: 'Probation', value: '6 Months', icon: 'Hourglass' },
    { label: 'Parties', value: 'Employer & Employee', icon: 'Users' },
    { label: 'Salary', value: 'Paid Monthly', icon: 'Banknote' },
    { label: 'Governing Law', value: 'State of Delaware', icon: 'Scale' },
    { label: 'Non-Compete', value: '12 Months Post-Term', icon: 'Ban' },
  ],
  'doc-nda': [
    { label: 'Contract Type', value: 'Mutual NDA', icon: 'FileText' },
    { label: 'Term', value: '3 Years', icon: 'CalendarClock' },
    { label: 'Confidentiality', value: 'Mutual, Present', icon: 'ShieldCheck' },
    { label: 'Parties', value: 'Disclosing & Receiving Party', icon: 'Users' },
    { label: 'Governing Law', value: 'State of New York', icon: 'Scale' },
    { label: 'Return of Materials', value: 'Within 30 Days', icon: 'RotateCcw' },
  ],
  'doc-vendor': [
    { label: 'Contract Type', value: 'Vendor Services Agreement', icon: 'FileText' },
    { label: 'Payment Terms', value: 'Net 45', icon: 'Banknote' },
    { label: 'Termination Notice', value: '60 Days', icon: 'CalendarClock' },
    { label: 'Liability Cap', value: '12 Months Fees', icon: 'ShieldCheck' },
    { label: 'Parties', value: 'Client & Vendor', icon: 'Users' },
    { label: 'Governing Law', value: 'State of California', icon: 'Scale' },
  ],
  'doc-msa': [
    { label: 'Contract Type', value: 'Master Services Agreement', icon: 'FileText' },
    { label: 'Payment Terms', value: 'Net 30', icon: 'Banknote' },
    { label: 'Termination Notice', value: '90 Days', icon: 'CalendarClock' },
    { label: 'Confidentiality', value: 'Present, 5 Years', icon: 'ShieldCheck' },
    { label: 'Parties', value: 'Client & Service Provider', icon: 'Users' },
    { label: 'Governing Law', value: 'State of Delaware', icon: 'Scale' },
    { label: 'Indemnification', value: 'Mutual', icon: 'Handshake' },
    { label: 'Dispute Resolution', value: 'Binding Arbitration', icon: 'Gavel' },
  ],
}

export const recentQuestionsByDocument: Record<string, RecentQuestion[]> = {
  'doc-employment': [
    { id: 'q1', question: 'What is the notice period for resignation?', askedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: 'q2', question: 'Is there a non-compete clause?', askedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
    { id: 'q3', question: 'How is the annual bonus calculated?', askedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
  ],
  'doc-nda': [
    { id: 'q4', question: 'How long does the confidentiality obligation last?', askedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  ],
  'doc-vendor': [
    { id: 'q5', question: 'What are the payment terms?', askedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
  ],
  'doc-msa': [
    { id: 'q6', question: 'What is the liability cap?', askedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
  ],
}

const employmentConversation: ChatMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'What is the notice period required for resignation?',
    createdAt: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
  },
  {
    id: 'm2',
    role: 'assistant',
    content:
      "The employee must provide **90 days written notice** prior to resignation. During the notice period, the employee remains bound by all obligations under this agreement, including confidentiality and non-solicitation clauses.\n\nIf the company waives the notice period, it may do so at its sole discretion without additional compensation, unless otherwise agreed in writing.",
    citations: [
      { id: 'c1', page: 12, section: 'Section 8.2 — Termination by Employee', excerpt: 'The Employee shall provide the Company with no less than ninety (90) days prior written notice of resignation. The Company may, at its sole discretion, waive all or part of this notice period.' },
      { id: 'c2', page: 13, section: 'Section 8.4 — Continuing Obligations', excerpt: 'During any notice period, the Employee shall remain bound by the confidentiality, non-solicitation, and cooperation obligations set forth in Sections 11 and 12.' },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'm3',
    role: 'user',
    content: 'Is there a non-compete clause, and how long does it last?',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'm4',
    role: 'assistant',
    content:
      'Yes. The agreement includes a non-compete clause that restricts the employee from joining or forming a competing business for **12 months after termination**, within the same geographic market.\n\n| Restriction | Duration | Scope |\n|---|---|---|\n| Non-compete | 12 months | Same geographic market |\n| Non-solicitation (clients) | 18 months | All active clients |\n| Non-solicitation (staff) | 18 months | Company-wide |\n\nCourts in some jurisdictions limit enforceability of non-compete clauses, so practical enforcement may vary by state.',
    citations: [
      { id: 'c3', page: 19, section: 'Section 14.1 — Non-Competition', excerpt: 'For a period of twelve (12) months following the Termination Date, the Employee shall not, directly or indirectly, engage in or provide services to any business that competes with the Company within the same geographic market.' },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 19).toISOString(),
  },
]

export const conversationsByDocument: Record<string, ChatMessage[]> = {
  'doc-employment': employmentConversation,
  'doc-nda': [
    {
      id: 'n1',
      role: 'user',
      content: 'How long does the confidentiality obligation last after the agreement ends?',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: 'n2',
      role: 'assistant',
      content:
        'The confidentiality obligations survive termination of the agreement for **3 years**, applying equally to both the disclosing and receiving parties.',
      citations: [
        { id: 'nc1', page: 4, section: 'Section 5 — Survival', excerpt: 'The obligations of confidentiality set forth herein shall survive termination of this Agreement for a period of three (3) years from the Effective Date.' },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ],
  'doc-vendor': [],
  'doc-msa': [],
}

export function generateAssistantReply(question: string, documentName: string): ChatMessage {
  const lower = question.toLowerCase()
  let content: string
  let citations: ChatMessage['citations']

  if (lower.includes('termina') || lower.includes('cancel')) {
    content = `Under **${documentName}**, either party may terminate the agreement with written notice, subject to the cure periods described below.\n\n- Termination for convenience requires **60 days** written notice\n- Termination for cause allows a **15-day cure period** before the agreement ends\n- Any outstanding fees remain due within 30 days of termination`
    citations = [
      { id: `gc-${Date.now()}-1`, page: 17, section: 'Section 9 — Termination', excerpt: 'Either party may terminate this Agreement for convenience upon sixty (60) days prior written notice to the other party.' },
    ]
  } else if (lower.includes('payment') || lower.includes('fee') || lower.includes('cost')) {
    content = `Payment terms in **${documentName}** are structured as follows:\n\n\`\`\`\nInvoice cycle: Monthly\nPayment due: Net 30\nLate fee: 1.5% per month\n\`\`\`\n\nInvoices are issued on the last business day of each month and are payable within 30 days of receipt.`
    citations = [
      { id: `gc-${Date.now()}-2`, page: 8, section: 'Section 4 — Fees and Payment', excerpt: 'Client shall pay all undisputed invoiced amounts within thirty (30) days of the invoice date. Late payments accrue interest at a rate of 1.5% per month.' },
    ]
  } else if (lower.includes('confidential')) {
    content = `Confidentiality obligations in **${documentName}** apply to both parties and cover any non-public business, technical, or financial information exchanged during the term of the agreement, surviving termination for a defined period.`
    citations = [
      { id: `gc-${Date.now()}-3`, page: 6, section: 'Section 6 — Confidential Information', excerpt: 'Each party agrees to hold in confidence all non-public information disclosed by the other party in connection with this Agreement.' },
    ]
  } else {
    content = `Based on my review of **${documentName}**, here is what I found relevant to your question:\n\nThe agreement addresses this in its general obligations section, which outlines the responsibilities of each party and the standard of care expected during performance. I'd recommend reviewing the cited clause directly for the precise contractual language.`
    citations = [
      { id: `gc-${Date.now()}-4`, page: 11, section: 'Section 7 — General Obligations', excerpt: 'Each party shall perform its obligations under this Agreement in good faith and in accordance with commercially reasonable standards of care.' },
    ]
  }

  return {
    id: `m-${Date.now()}`,
    role: 'assistant',
    content,
    citations,
    createdAt: new Date().toISOString(),
  }
}
