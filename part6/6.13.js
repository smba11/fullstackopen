import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { create } from 'zustand'

const useAnecdoteStore = create(() => ({
  anecdotes: [],
}))

const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  return anecdotes.toSorted((first, second) => second.votes - first.votes)
}

beforeEach(() => {
  useAnecdoteStore.setState({
    anecdotes: [
      { id: 1, content: 'least popular', votes: 0 },
      { id: 2, content: 'most popular', votes: 5 },
      { id: 3, content: 'middle popular', votes: 2 },
    ],
  })
})

describe('anecdote ordering', () => {
  it('returns anecdotes sorted by votes in descending order', () => {
    const { result } = renderHook(() => useAnecdotes())

    expect(result.current.map(anecdote => anecdote.content)).toEqual([
      'most popular',
      'middle popular',
      'least popular',
    ])
  })
})
