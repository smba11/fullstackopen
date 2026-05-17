import { create } from 'zustand'

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

const useAnecdoteStore = create(set => ({
  anecdotes: [],
  actions: {
    create: content => set(state => ({
      anecdotes: state.anecdotes.concat({ id: generateId(), content, votes: 0 }),
    })),
    vote: id => set(state => ({
      anecdotes: state.anecdotes.map(anecdote =>
        anecdote.id === id ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote
      ),
    })),
  },
}))

const useAnecdotes = () => useAnecdoteStore(state => state.anecdotes)
const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote } = useAnecdoteActions()

  return (
    <div>
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
    <AnecdoteList />
    <AnecdoteForm />
  </div>
)

export default App
