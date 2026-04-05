import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merges Tailwind classes safely without conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats a number (in cents) to a currency string e.g. 4999 → "$49.99"
export function formatPrice(price: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price / 100)
}

// Formats an ISO date string to a readable date e.g. "January 5, 2025"
export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// Converts a product name to a URL-friendly slug e.g. "Nike Air Max" → "nike-air-max"
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

// Calculates discount percentage e.g. price=80, compareAt=100 → 20%
export function calculateDiscount(price: number, compareAt: number) {
  return Math.round(((compareAt - price) / compareAt) * 100)
}

// Truncates long text with ellipsis e.g. for product descriptions in cards
export function truncate(text: string, length: number) {
  return text.length > length ? `${text.substring(0, length)}...` : text
}