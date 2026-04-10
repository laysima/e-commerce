import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

const supabase = createClient()

export function useCartSync(userId: string | null) {
  const cartItems = useCartStore(state => state.items)
  const wishlistItems = useWishlistStore(state => state.items)
  const hasSynced = useRef(false)

  // Load from DB when user logs in — only once per session
  useEffect(() => {
    if (!userId) {
      hasSynced.current = false
      return
    }
    if (hasSynced.current) return

    const loadData = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('cart_data, wishlist_data')
        .eq('id', userId)
        .single()

      if (data?.cart_data && Array.isArray(data.cart_data) && data.cart_data.length > 0) {
        useCartStore.setState({ items: data.cart_data })
      }

      if (data?.wishlist_data && Array.isArray(data.wishlist_data) && data.wishlist_data.length > 0) {
        useWishlistStore.setState({ items: data.wishlist_data })
      }

      hasSynced.current = true
    }

    loadData()
  }, [userId])

  // Save cart to DB on every change
  useEffect(() => {
    if (!userId || !hasSynced.current) return
    supabase
      .from('profiles')
      .update({ cart_data: cartItems })
      .eq('id', userId)
      .then(() => {})
  }, [cartItems, userId])

  // Save wishlist to DB on every change
  useEffect(() => {
    if (!userId || !hasSynced.current) return
    supabase
      .from('profiles')
      .update({ wishlist_data: wishlistItems })
      .eq('id', userId)
      .then(() => {})
  }, [wishlistItems, userId])
}