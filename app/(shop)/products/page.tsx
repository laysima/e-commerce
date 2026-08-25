import { createClient } from '@/lib/supabase/server'
import CatalogView from '@/components/shop/CatalogView'
import type { Category, Product } from '@/types'

interface PageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    sort?: string
    min?: string
    max?: string
  }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: categoriesData } = await supabase.from('categories').select('*').order('name')
  const categories = (categoriesData ?? []) as Category[]

  let query = supabase
    .from('products')
    .select('*, category:categories(name, slug)')
    .eq('is_active', true)

  if (params.search) query = query.ilike('name', `%${params.search}%`)
  if (params.category) {
    const category = categories.find(item => item.slug === params.category)
    if (category) query = query.eq('category_id', category.id)
  }
  if (params.min) query = query.gte('price', Number.parseInt(params.min, 10) * 100)
  if (params.max) query = query.lte('price', Number.parseInt(params.max, 10) * 100)

  if (params.sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (params.sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data: productsData } = await query
  const products = (productsData ?? []) as Product[]
  const activeCategory = categories.find(category => category.slug === params.category)
  const title = params.search ? `“${params.search}”` : activeCategory?.name ?? 'Our collection'

  return (
    <CatalogView
      eyebrow={params.search ? 'Search results' : 'Collection / 2026'}
      title={title}
      description={activeCategory?.description ?? 'A considered selection of clothing and footwear, chosen for proportion, material, and everyday use.'}
      products={products}
      categories={categories}
      activeCategorySlug={params.category}
      searchQuery={params.search}
      sort={params.sort}
    />
  )
}
