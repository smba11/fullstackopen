import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { create } from 'zustand'

const useAnecdoteStore = create(() => ({
  anecdotes: [],
  filter: '',
}))

const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  return anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )
}

beforeEach(() => {
  useAnecdoteStore.setState({
    filter: 'react',
    anecdotes: [
      { id: 1, content: 'React makes reusable UI possible', votes: 0 },
      { id: 2, content: 'Zustand stores client state', votes: 1 },
      { id: 3, content: 'React Query handles server state', votes: 2 },
    ],
  })
})

describe('anecdote filtering', () => {
  it('returns only anecdotes matching the current filter', () => {
    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toHaveLength(2)
    expect(result.current.map(anecdote => anecdote.content)).toEqual([
      'React makes reusable UI possible',
      'React Query handles server state',
    ])
  })
})
