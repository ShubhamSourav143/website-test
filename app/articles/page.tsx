'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ArticleItem {
  id: string
  title: string
  content: string
  created_at: string
  profiles?: { full_name?: string | null }
}

export default function ArticlesPage() {
  const [posts, setPosts] = useState<ArticleItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('posts')
        .select('id, title, content, created_at')
        .order('created_at', { ascending: false })
        .limit(20)
      setPosts(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
        <Link href="/articles/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">New Post</Link>
      </div>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <Link key={p.id} href={`/articles/${p.id}`} className="block p-5 bg-white rounded-xl border hover:shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{p.content}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(p.created_at).toLocaleString()}</p>
            </Link>
          ))}
          {posts.length === 0 && (
            <div className="text-gray-600">No posts yet.</div>
          )}
        </div>
      )}
    </div>
  )
}


