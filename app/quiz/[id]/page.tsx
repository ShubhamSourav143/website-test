'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Question {
  id: string
  question_text: string
  options: string[]
  correct_answer: string
}

export default function QuizTakePage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params?.id as string
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('quiz_questions')
        .select('id, question_text, options, correct_answer')
        .eq('quiz_id', quizId)
      setQuestions(data ?? [])
      setLoading(false)
    }
    if (quizId) load()
  }, [quizId])

  const score = useMemo(() => {
    let s = 0
    for (const q of questions) {
      if (answers[q.id] && answers[q.id] === q.correct_answer) s++
    }
    return s
  }, [answers, questions])

  const submit = async () => {
    setError(null)
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth.user?.id
    if (!userId) {
      router.push('/login')
      return
    }
    const { data: attempt, error: insertError } = await supabase
      .from('quiz_attempts')
      .insert({ quiz_id: quizId, user_id: userId, score })
      .select('id')
      .single()
    if (insertError || !attempt) {
      setError(insertError?.message || 'Failed to submit')
      return
    }
    router.replace(`/quiz/results/${attempt.id}`)
  }

  if (loading) return <div>Loading…</div>
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quiz</h1>
      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="p-4 bg-white border rounded-lg">
            <div className="font-medium text-gray-900 mb-3">{idx + 1}. {q.question_text}</div>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <label key={opt} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">Score so far: {score}/{questions.length}</div>
        <button onClick={submit} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Submit</button>
      </div>
      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
    </div>
  )
}


