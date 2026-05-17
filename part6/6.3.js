import { create } from 'zustand'

const generateId = () => Number((Math.random() * 1000000).toFixed(0))

const useAnecdoteStore = create(set => ({
  anecdotes: [],
  actions: {
    create: content => set(state => ({
      anecdotes: state.anecdotes.concat({
        id: generateId(),
        content,
        votes: 0,
      }),
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

const App = () => {
  const anecdotes = useAnecdotes()
  const { create, vote } = useAnecdoteActions()

  const addAnecdote = event => {
    event.preventDefault()
    create(event.target.anecdote.value)
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
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App
