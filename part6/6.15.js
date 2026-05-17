import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { create } from 'zustand'

const anecdoteService = {
  update: vi.fn(),
}

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  actions: {
    vote: async id => {
      const anecdote = get().anecdotes.find(item => item.id === id)
      const voted = await anecdoteService.update({ ...anecdote, votes: anecdote.votes + 1 })

      set(state => ({
        anecdotes: state.anecdotes.map(item => item.id === id ? voted : item),
      }))
    },
  },
}))

const useAnecdotes = () => useAnecdoteStore(state => state.anecdotes)
const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

beforeEach(() => {
  useAnecdoteStore.setState({
    anecdotes: [{ id: 1, content: 'testing votes', votes: 0 }],
  })
  vi.clearAllMocks()
})

describe('voting', () => {
  it('increases the number of votes for an anecdote', async () => {
    anecdoteService.update.mockResolvedValue({
      id: 1,
      content: 'testing votes',
      votes: 1,
    })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.vote(1)
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    expect(anecdotesResult.current[0].votes).toBe(1)
  })
})
