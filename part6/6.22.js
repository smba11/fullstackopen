import { createContext, useContext, useReducer } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload
    case 'HIDE':
      return null
    default:
      return state
  }
}

let notificationTimeout

const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  const notify = message => {
    clearTimeout(notificationTimeout)
    dispatch({ type: 'SHOW', payload: message })
    notificationTimeout = setTimeout(() => {
      dispatch({ type: 'HIDE' })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}

const useNotify = () => {
  const { notify } = useContext(NotificationContext)
  return notify
}

const useNotification = () => {
  const { notification } = useContext(NotificationContext)
  return notification
}

const Notification = () => {
  const notification = useNotification()

  if (!notification) {
    return null
  }

  return <div>{notification}</div>
}

const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()
  const query = useQuery({
    queryKey: ['anecdotes'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/anecdotes')
      if (!response.ok) throw new Error('anecdote service failed')
      return await response.json()
    },
    retry: false,
  })
  const createMutation = useMutation({
    mutationFn: async content => {
      const response = await fetch('http://localhost:3001/anecdotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, votes: 0 }),
      })
      if (!response.ok) throw new Error('too short anecdote, must have length 5 or more')
      return await response.json()
    },
    onSuccess: newAnecdote => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`anecdote '${newAnecdote.content}' created`)
    },
    onError: error => notify(error.message),
  })
  const voteMutation = useMutation({
    mutationFn: async anecdote => {
      const response = await fetch(`http://localhost:3001/anecdotes/${anecdote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...anecdote, votes: anecdote.votes + 1 }),
      })
      return await response.json()
    },
    onSuccess: votedAnecdote => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`you voted '${votedAnecdote.content}'`)
    },
  })

  return {
    query,
    create: content => createMutation.mutate(content),
    vote: anecdote => voteMutation.mutate(anecdote),
  }
}

const App = () => {
  const { query, create, vote } = useAnecdotes()

  if (query.isPending) return <div>loading data...</div>
  if (query.isError) return <div>anecdote service not available due to problems in server</div>

  const addAnecdote = event => {
    event.preventDefault()
    create(event.target.anecdote.value)
    event.target.reset()
  }

  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      {query.data.map(anecdote =>
        <div key={anecdote.id}>
          {anecdote.content} has {anecdote.votes}
          <button onClick={() => vote(anecdote)}>vote</button>
        </div>
      )}
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

const Root = () => (
  <NotificationContextProvider>
    <App />
  </NotificationContextProvider>
)

export default Root
