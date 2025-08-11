'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Quiz {
  id: string
  title: string
  category: string
  is_member_only: boolean
}

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('quizzes')
        .select('id, title, category, is_member_only')
        .order('title', { ascending: true })
      setQuizzes(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quizzes</h1>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizzes.map((q) => (
            <Link key={q.id} href={`/quiz/${q.id}`} className="p-4 bg-white border rounded-lg hover:shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{q.title}</h3>
                  <p className="text-sm text-gray-600">Category: {q.category}</p>
                </div>
                {q.is_member_only && (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Members</span>
                )}
              </div>
            </Link>
          ))}
          {quizzes.length === 0 && <div>No quizzes yet.</div>}
        </div>
      )}
    </div>
  )
}


