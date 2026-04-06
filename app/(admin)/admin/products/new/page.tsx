import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

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
          Add New Product
        </h1>
      </div>
      <ProductForm categories={categories ?? []} />
    </div>
  )
}