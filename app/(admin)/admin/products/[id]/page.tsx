import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!product) notFound()

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="eyebrow mb-2">Admin</p>
        <h1
          style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 400,
            fontSize: '2.2rem',
            color: 'var(--navy)',
          }}
        >
          Edit Product
        </h1>
      </div>
      <ProductForm categories={categories ?? []} product={product} />
    </div>
  )
}