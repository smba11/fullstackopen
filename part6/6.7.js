import { useEffect } from 'react'
import { create } from 'zustand'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('failed to fetch anecdotes')
  }

  return await response.json()
}

const useAnecdoteStore = create(set => ({
  anecdotes: [],
  actions: {
    initialize: async () => {
      const anecdotes = await getAll()
      set({ anecdotes })
    },
    vote: id => set(state => ({
      anecdotes: state.anecdotes.map(anecdote =>
        anecdote.id === id ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote
      ),
    })),
  },
}))

const useAnecdotes = () => useAnecdoteStore(state => state.anecdotes)
const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

const App = () => {
  const anecdotes = useAnecdotes()
  const { initialize, vote } = useAnecdoteActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
