import { create } from 'zustand'

let notificationTimer

const useNotificationStore = create(set => ({
  message: null,
  actions: {
    notify: message => {
      clearTimeout(notificationTimer)
      set({ message })
      notificationTimer = setTimeout(() => {
        set({ message: null })
      }, 5000)
    },
  },
}))

const useNotification = () => useNotificationStore(state => state.message)
const useNotificationActions = () => useNotificationStore(state => state.actions)

const useAnecdoteStore = create(set => ({
  anecdotes: [],
  actions: {
    create: anecdote => set(state => ({
      anecdotes: state.anecdotes.concat(anecdote),
    })),
    vote: anecdote => set(state => ({
      anecdotes: state.anecdotes.map(item =>
        item.id === anecdote.id ? { ...item, votes: item.votes + 1 } : item
      ),
    })),
  },
}))

const useAnecdotes = () => useAnecdoteStore(state => state.anecdotes)
const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

const Notification = () => {
  const message = useNotification()

  if (!message) {
    return null
  }

  return (
    <div style={{ border: 'solid', padding: 10, borderWidth: 1, marginBottom: 10 }}>
      {message}
    </div>
  )
}

const App = () => {
  const anecdotes = useAnecdotes()
  const { create, vote } = useAnecdoteActions()
  const { notify } = useNotificationActions()

  const addAnecdote = event => {
    event.preventDefault()
    const content = event.target.anecdote.value
    create({ id: Date.now(), content, votes: 0 })
    notify(`you created '${content}'`)
    event.target.reset()
  }

  const voteFor = anecdote => {
    vote(anecdote)
    notify(`you voted '${anecdote.content}'`)
  }

  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          {anecdote.content} has {anecdote.votes}
          <button onClick={() => voteFor(anecdote)}>vote</button>
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
