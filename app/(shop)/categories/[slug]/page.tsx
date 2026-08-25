import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CatalogView from '@/components/shop/CatalogView'
import type { Category, Product } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sort?: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', slug)
    .single()

  return category ? { title: category.name, description: category.description } : {}
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const [{ slug }, { sort }] = await Promise.all([params, searchParams])
  const supabase = await createClient()
  const [{ data: categoryData }, { data: categoriesData }] = await Promise.all([
    supabase.from('categories').select('*').eq('slug', slug).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!categoryData) notFound()
  const category = categoryData as Category
  const categories = (categoriesData ?? []) as Category[]

  let query = supabase
    .from('products')
    .select('*, category:categories(name, slug)')
    .eq('category_id', category.id)
    .eq('is_active', true)

  if (sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data: productsData } = await query

  return (
    <CatalogView
      eyebrow="Department"
      title={category.name}
      description={category.description}
      products={(productsData ?? []) as Product[]}
      categories={categories}
      activeCategorySlug={slug}
      sort={sort}
      categoryRoutes
    />
  )
}
