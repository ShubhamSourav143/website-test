'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Post {
  id: string
  title: string
  content: string
  created_at: string
}

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [post, setPost] = useState<Post | null>(null)
  const [liked, setLiked] = useState(false)
  const [likeId, setLikeId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('posts')
        .select('id, title, content, created_at')
        .eq('id', id)
        .single()
      setPost(data)
      setLoading(false)
      // pre-check like
      const { data: user } = await supabase.auth.getUser()
      const userId = user.user?.id
      if (userId) {
        const { data: like } = await supabase
          .from('post_likes')
          .select('id')
          .eq('user_id', userId)
          .eq('post_id', id)
          .maybeSingle()
        if (like) {
          setLiked(true)
          setLikeId(like.id)
        }
      }
    }
    if (id) load()
  }, [id])

  const toggleLike = async () => {
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth.user?.id
    if (!userId) {
      router.push('/login')
      return
    }
    if (liked && likeId) {
      await supabase.from('post_likes').delete().eq('id', likeId)
      setLiked(false)
      setLikeId(null)
    } else {
      const { data, error } = await supabase
        .from('post_likes')
        .insert({ user_id: userId, post_id: id })
        .select('id')
        .single()
      if (!error && data) {
        setLiked(true)
        setLikeId(data.id)
      }
    }
  }

  if (loading) return <div>Loading…</div>
  if (!post) return <div>Not found</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
      <p className="text-xs text-gray-500 mb-6">{new Date(post.created_at).toLocaleString()}</p>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="mt-6">
        <button onClick={toggleLike} className={`px-4 py-2 rounded-lg border ${liked ? 'bg-pink-50 text-pink-600 border-pink-200' : 'hover:bg-gray-50'}`}>
          {liked ? '♥ Liked' : '♡ Like'}
        </button>
      </div>
    </div>
  )
}


