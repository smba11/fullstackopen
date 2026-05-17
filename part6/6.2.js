import { create } from 'zustand'

const initialAnecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later',
  'The first 90 percent of the code accounts for the first 90 percent of the development time',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand',
]

const useAnecdoteStore = create(set => ({
  anecdotes: initialAnecdotes.map((content, index) => ({
    id: index + 1,
    content,
    votes: 0,
  })),
  vote: id => set(state => ({
    anecdotes: state.anecdotes.map(anecdote =>
      anecdote.id === id
        ? { ...anecdote, votes: anecdote.votes + 1 }
        : anecdote
    ),
  })),
}))

const App = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const vote = useAnecdoteStore(state => state.vote)

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
