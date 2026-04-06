'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import { Loader2, Plus, X, Upload } from 'lucide-react'
import Image from 'next/image'

type Category = {
  id: string
  name: string
}

type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  images: string[]
  category_id: string | null
  inventory_count: number
  is_featured: boolean
  is_active: boolean
}

interface Props {
  categories: Category[]
  product?: Product
}

const labelStyle = {
  fontFamily: 'Jost, sans-serif',
  fontSize: '0.68rem',
  fontWeight: 500 as const,
  letterSpacing: '0.15em',
  textTransform: 'uppercase' as const,
  color: 'var(--gray-600)',
  display: 'block',
  marginBottom: '8px',
}

const inputStyle = {
  fontFamily: 'Jost, sans-serif',
  fontWeight: 300,
  fontSize: '0.88rem',
  color: 'var(--gray-900)',
  backgroundColor: 'var(--gray-50)',
  border: '1px solid var(--gray-200)',
  padding: '11px 14px',
  width: '100%',
  outline: 'none',
}

export default function ProductForm({ categories, product }: Props) {
  const isEditing = !!product
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    price: product ? (product.price / 100).toString() : '',
    compare_at_price: product?.compare_at_price
      ? (product.compare_at_price / 100).toString()
      : '',
    category_id: product?.category_id ?? '',
    inventory_count: product?.inventory_count.toString() ?? '0',
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
    images: product?.images ?? [],
  })

  const update = (key: string, value: string | boolean | string[]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleNameChange = (name: string) => {
    update('name', name)
    if (!isEditing) update('slug', slugify(name))
  }

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      update('images', [...form.images, imageUrl.trim()])
      setImageUrl('')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    // Create unique filename
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filename, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setError(uploadError.message)
      setIsUploading(false)
      return
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path)

    update('images', [...form.images, publicUrl])
    setIsUploading(false)
  }

  const removeImage = (index: number) => {
    update('images', form.images.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    if (!form.name || !form.price) {
      setError('Name and price are required')
      setIsLoading(false)
      return
    }

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: Math.round(parseFloat(form.price) * 100),
      compare_at_price: form.compare_at_price
        ? Math.round(parseFloat(form.compare_at_price) * 100)
        : null,
      category_id: form.category_id || null,
      inventory_count: parseInt(form.inventory_count),
      is_featured: form.is_featured,
      is_active: form.is_active,
      images: form.images,
    }

    if (isEditing) {
      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id)
      if (error) { setError(error.message); setIsLoading(false); return }
    } else {
      const { error } = await supabase
        .from('products')
        .insert(payload)
      if (error) { setError(error.message); setIsLoading(false); return }
    }

    router.push('/admin/products')
    router.refresh()
  }

  return (
    <div className="max-w-2xl">
      {error && (
        <div
          className="mb-6 px-4 py-3 text-sm"
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            fontFamily: 'Jost, sans-serif',
          }}
        >
          {error}
        </div>
      )}

      <div
        className="p-8 space-y-6"
        style={{ backgroundColor: 'var(--white)', border: '1px solid var(--gray-100)' }}
      >
        {/* Name */}
        <div>
          <label style={labelStyle}>Product Name</label>
          <input
            style={inputStyle}
            value={form.name}
            onChange={e => handleNameChange(e.target.value)}
            placeholder="Classic Oxford Shirt"
          />
        </div>

        {/* Slug */}
        <div>
          <label style={labelStyle}>Slug</label>
          <input
            style={inputStyle}
            value={form.slug}
            onChange={e => update('slug', e.target.value)}
            placeholder="classic-oxford-shirt"
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder="Product description..."
          />
        </div>

        {/* Price + Compare At */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Price ($)</label>
            <input
              style={inputStyle}
              type="number"
              step="0.01"
              value={form.price}
              onChange={e => update('price', e.target.value)}
              placeholder="49.99"
            />
          </div>
          <div>
            <label style={labelStyle}>Compare At Price ($)</label>
            <input
              style={inputStyle}
              type="number"
              step="0.01"
              value={form.compare_at_price}
              onChange={e => update('compare_at_price', e.target.value)}
              placeholder="69.99 (optional)"
            />
          </div>
        </div>

        {/* Category + Inventory */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Category</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              value={form.category_id}
              onChange={e => update('category_id', e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Inventory Count</label>
            <input
              style={inputStyle}
              type="number"
              value={form.inventory_count}
              onChange={e => update('inventory_count', e.target.value)}
              placeholder="100"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label style={labelStyle}>Product Images</label>

          {/* Upload from device */}
          <label
            className="flex items-center justify-center gap-3 w-full cursor-pointer transition-opacity hover:opacity-70 mb-3"
            style={{
              border: '2px dashed var(--gray-200)',
              padding: '20px',
              backgroundColor: isUploading ? 'var(--gray-50)' : 'var(--white)',
            }}
          >
            {isUploading ? (
              <><Loader2 size={16} className="animate-spin" style={{ color: 'var(--gold)' }} />
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: 'var(--gray-400)' }}>
                Uploading...
              </span></>
            ) : (
              <><Upload size={16} style={{ color: 'var(--gold)' }} />
              <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: 'var(--gray-400)' }}>
                Click to upload from your device
              </span></>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>

          {/* Or paste URL */}
          <div className="flex gap-2 mb-3">
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="Or paste an image URL..."
              onKeyDown={e => e.key === 'Enter' && addImageUrl()}
            />
            <button
              onClick={addImageUrl}
              className="flex items-center gap-1 px-4 transition-opacity hover:opacity-70 shrink-0"
              style={{
                backgroundColor: 'var(--navy)',
                color: 'var(--cream)',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.7rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
              }}
            >
              <Plus size={13} /> Add
            </button>
          </div>

          {/* Image Previews */}
          {form.images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-3">
              {form.images.map((img, i) => (
                <div
                  key={i}
                  className="relative group"
                  style={{ aspectRatio: '3/4' }}
                >
                  <Image
                    src={img}
                    alt={`Product image ${i + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }}
                  >
                    <X size={11} />
                  </button>
                  {i === 0 && (
                    <span
                      className="absolute bottom-1 left-1"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        fontFamily: 'Jost, sans-serif',
                        fontSize: '0.55rem',
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        padding: '2px 6px',
                      }}
                    >
                      MAIN
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="flex gap-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={e => update('is_active', e.target.checked)}
              style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }}
            />
            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: 'var(--gray-600)' }}>
              Active (visible to customers)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={e => update('is_featured', e.target.checked)}
              style={{ accentColor: 'var(--gold)', width: '16px', height: '16px' }}
            />
            <span style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: 'var(--gray-600)' }}>
              Featured on homepage
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-3 transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{
              backgroundColor: 'var(--navy)',
              color: 'var(--cream)',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              padding: '13px 28px',
            }}
          >
            {isLoading ? (
              <><Loader2 size={14} className="animate-spin" />
              {isEditing ? 'Saving...' : 'Creating...'}</>
            ) : (
              isEditing ? 'Save Changes' : 'Create Product'
            )}
          </button>
          <button
            onClick={() => router.back()}
            className="transition-opacity hover:opacity-50"
            style={{
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 300,
              color: 'var(--gray-400)',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}