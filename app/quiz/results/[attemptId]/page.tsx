'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Attempt {
  id: string
  quiz_id: string
  user_id: string
  score: number
  created_at: string
}

export default function QuizResultPage() {
  const params = useParams()
  const attemptId = params?.attemptId as string
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [percentile, setPercentile] = useState<number | null>(null)
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    async function load() {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth.user?.id
      if (!userId) return
      const { data } = await supabase
        .from('quiz_attempts')
        .select('id, quiz_id, user_id, score, created_at')
        .eq('id', attemptId)
        .single()
      if (!data) return
      setAttempt(data)
      // Compute percentile client-side via counts
      const { count: totalCount } = await supabase
        .from('quiz_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', data.quiz_id)
      const { count: lessOrEqual } = await supabase
        .from('quiz_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', data.quiz_id)
        .lte('score', data.score)
      if (totalCount && lessOrEqual) {
        setTotal(totalCount)
        setPercentile(Math.round((lessOrEqual / totalCount) * 100))
      }
    }
    if (attemptId) load()
  }, [attemptId])

  if (!attempt) return <div>Loading…</div>

  return (
    <div className="max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-2">Quiz Result</h1>
      <p className="text-gray-600 mb-6">Attempt ID: {attempt.id}</p>
      <div className="bg-white rounded-xl border p-6">
        <div className="text-3xl font-extrabold text-gray-900">{attempt.score}</div>
        <div className="text-sm text-gray-500">Score</div>
        <div className="mt-4 text-lg">
          {percentile !== null ? (
            <span className="text-green-700 font-semibold">{percentile}th percentile</span>
          ) : (
            <span className="text-gray-500">Calculating percentile…</span>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-1">based on {total} attempts</div>
      </div>
      <a href={`/quiz/${attempt.quiz_id}`} className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Retake Quiz</a>
    </div>
  )
}


