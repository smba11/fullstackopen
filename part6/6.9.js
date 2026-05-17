import { useEffect } from 'react'
import { create } from 'zustand'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => (await fetch(baseUrl)).json()

const createNew = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })
  return await response.json()
}

const update = async (anecdote) => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })
  return await response.json()
}

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  actions: {
    initialize: async () => set({ anecdotes: await getAll() }),
    create: async content => {
      const anecdote = await createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(anecdote) }))
    },
    vote: async id => {
      const anecdote = get().anecdotes.find(item => item.id === id)
      const voted = await update({ ...anecdote, votes: anecdote.votes + 1 })
      set(state => ({
        anecdotes: state.anecdotes.map(item => item.id === id ? voted : item),
      }))
    },
  },
}))

const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  return anecdotes.toSorted((first, second) => second.votes - first.votes)
}

const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

const App = () => {
  const anecdotes = useAnecdotes()
  const { initialize, vote, create } = useAnecdoteActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  const addAnecdote = async event => {
    event.preventDefault()
    await create(event.target.anecdote.value)
    event.target.reset()
  }

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
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App
