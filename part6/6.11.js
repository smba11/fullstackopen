import { create } from 'zustand'

const useAnecdoteStore = create(set => ({
  anecdotes: [
    { id: 1, content: 'If it hurts, do it more often', votes: 1 },
    { id: 2, content: 'A bad anecdote', votes: 0 },
  ],
  actions: {
    remove: id => set(state => ({
      anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== id),
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
  const { vote, remove } = useAnecdoteActions()

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => remove(anecdote.id)}>remove</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
