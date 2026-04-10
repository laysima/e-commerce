'use client'

import { useCartSync } from '@/hooks/useCartSync'

export default function CartSyncProvider({ userId }: { userId: string | null }) {
  useCartSync(userId)
  return null
}