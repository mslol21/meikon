import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string | null | undefined): string {
  const amount = typeof value === 'string' ? parseFloat(value) : value
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'R$ 0'
  }
  if (amount === 0) return 'R$ 0'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount).replace(/,00$/, '')
}

export function formatCompactNumber(value: number): string {
  if (Math.abs(value) < 1000) return value.toString()
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value).replace(' mil', 'k')
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A"
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return "Data Inválida"
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateObj)
  } catch (error) {
    console.error("formatDate error:", error)
    return "Data Inválida"
  }
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "N/A"
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return "Data Inválida"
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj)
  } catch (error) {
    console.error("formatDateTime error:", error)
    return "Data Inválida"
  }
}
