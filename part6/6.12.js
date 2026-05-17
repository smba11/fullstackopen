import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { create } from 'zustand'

const anecdoteService = {
  getAll: vi.fn(),
}

const useAnecdoteStore = create(set => ({
  anecdotes: [],
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set({ anecdotes })
    },
  },
}))

const useAnecdotes = () => useAnecdoteStore(state => state.anecdotes)
const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [] })
  vi.clearAllMocks()
})

describe('anecdote store initialization', () => {
  it('initializes anecdotes with data returned by the backend', async () => {
    const anecdotes = [
      { id: 1, content: 'testing Zustand stores', votes: 0 },
      { id: 2, content: 'mocking services is useful', votes: 3 },
    ]

    anecdoteService.getAll.mockResolvedValue(anecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())

    expect(anecdotesResult.current).toEqual(anecdotes)
  })
})
