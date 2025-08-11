'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function NewArticlePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Optional: check membership to show/hide form
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      const user = data.user
      if (!user) {
        router.replace('/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_member')
        .eq('id', user.id)
        .single()
      if (!profile?.is_member) {
        router.replace('/membership')
      }
    })()
  }, [router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user) {
      setError('Not authenticated')
      setSubmitting(false)
      return
    }
    const { error: insertError, data: inserted } = await supabase
      .from('posts')
      .insert({ author_id: user.id, title, content })
      .select('id')
      .single()
    setSubmitting(false)
    if (insertError) {
      setError(insertError.message)
    } else if (inserted?.id) {
      router.replace(`/articles/${inserted.id}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-4 py-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full px-4 py-2 border rounded min-h-64"
          placeholder="Write your article (HTML allowed for now)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button
          disabled={submitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50"
          type="submit"
        >
          {submitting ? 'Publishing…' : 'Publish'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  )
}


