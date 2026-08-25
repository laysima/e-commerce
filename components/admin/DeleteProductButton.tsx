'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteProductButton({ id, name }: { id: string, name: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setIsLoading(true)
    await supabase.from('products').delete().eq('id', id)
    setIsOpen(false)
    router.refresh()
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="transition-opacity hover:opacity-60"
        style={{ color: 'var(--gray-300)' }}
        aria-label="Delete product"
      >
        <span style={{ fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Delete</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(12,19,34,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md p-8 relative"
            style={{
              backgroundColor: 'var(--white)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.15)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 transition-opacity hover:opacity-50"
              style={{ color: 'var(--gray-400)' }}
              aria-label="Close delete confirmation"
            >
              Close
            </button>

            {/* Text */}
            <h3
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400,
                fontSize: '1.4rem',
                color: 'var(--navy)',
                marginBottom: '0.75rem',
              }}
            >
              Delete Product
            </h3>
            <p
              style={{
                fontFamily: 'Jost, sans-serif',
                fontWeight: 300,
                fontSize: '0.88rem',
                color: 'var(--gray-400)',
                lineHeight: 1.7,
                marginBottom: '2rem',
              }}
            >
              Are you sure you want to delete{' '}
              <span style={{ color: 'var(--navy)', fontWeight: 400 }}>
                {name}
              </span>
              ? This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 flex-1 transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{
                  backgroundColor: '#EF4444',
                  color: 'var(--white)',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '13px',
                }}
              >
                {isLoading ? 'Deleting…' : 'Delete Product'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 transition-opacity hover:opacity-60"
                style={{
                  border: '1px solid var(--gray-200)',
                  color: 'var(--gray-600)',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 400,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  padding: '13px',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
