import { useEffect } from 'react'
import { create } from 'zustand'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)
  return await response.json()
}

const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })

  if (!response.ok) {
    throw new Error('failed to create anecdote')
  }

  return await response.json()
}

const useAnecdoteStore = create(set => ({
  anecdotes: [],
  actions: {
    initialize: async () => set({ anecdotes: await getAll() }),
    create: async content => {
      const anecdote = await createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(anecdote) }))
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

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions()

  const addAnecdote = async event => {
    event.preventDefault()
    await create(event.target.anecdote.value)
    event.target.reset()
  }

  return (
    <form onSubmit={addAnecdote}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

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
      <AnecdoteForm />
    </div>
  )
}

export default App
