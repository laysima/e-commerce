export type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price: number | null
  images: string[]
  category_id: string
  category?: Category
  variants?: ProductVariant[]
  inventory_count: number
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export type ProductVariant = {
  id: string
  product_id: string
  name: string        // e.g. "Size", "Color"
  value: string       // e.g. "XL", "Red"
  price_modifier: number
  inventory_count: number
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
}

export type CartItem = {
  id: string
  product: Product
  variant?: ProductVariant
  quantity: number
}

export type Order = {
  id: string
  user_id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  shipping_address: Address
  stripe_payment_intent_id: string
  created_at: string
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product: Product
  variant_id: string | null
  quantity: number
  unit_price: number
}

export type Address = {
  full_name: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: 'customer' | 'admin'
  created_at: string
}

export type WishlistItem = {
  id: string
  user_id: string
  product_id: string
  product: Product
}