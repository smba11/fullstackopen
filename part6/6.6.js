import { create } from 'zustand'

const useAnecdoteStore = create(set => ({
  anecdotes: [
    { id: 1, content: 'If it hurts, do it more often', votes: 0 },
    { id: 2, content: 'Adding manpower to a late software project makes it later', votes: 0 },
  ],
  filter: '',
  actions: {
    create: content => set(state => ({
      anecdotes: state.anecdotes.concat({
        id: Number((Math.random() * 1000000).toFixed(0)),
        content,
        votes: 0,
      }),
    })),
    vote: id => set(state => ({
      anecdotes: state.anecdotes.map(anecdote =>
        anecdote.id === id ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote
      ),
    })),
    setFilter: filter => set({ filter }),
  },
}))

const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  return anecdotes
    .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    .toSorted((first, second) => second.votes - first.votes)
}

const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

const Filter = () => {
  const { setFilter } = useAnecdoteActions()

  return (
    <div style={{ marginBottom: 10 }}>
      filter <input onChange={event => setFilter(event.target.value)} />
    </div>
  )
}

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions()

  return anecdotes.map(anecdote =>
    <div key={anecdote.id}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={() => vote(anecdote.id)}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteForm = () => {
  const { create } = useAnecdoteActions()

  const addAnecdote = event => {
    event.preventDefault()
    create(event.target.anecdote.value)
    event.target.reset()
  }

  return (
    <form onSubmit={addAnecdote}>
      <input name="anecdote" />
      <button type="submit">create</button>
    </form>
  )
}

const App = () => (
  <div>
    <h2>Anecdotes</h2>
    <Filter />
    <AnecdoteList />
    <AnecdoteForm />
  </div>
)

export default App
