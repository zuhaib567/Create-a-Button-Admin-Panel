// Type Imports
import type { InvoiceType } from '@/types/apps/invoiceTypes'

const now = new Date()
const currentMonth = now.toLocaleString('default', { month: 'short' })

export const db: InvoiceType[] = []
