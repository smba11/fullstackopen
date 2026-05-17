import { createContext, useContext, useReducer } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

let notificationTimer

const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  const notify = message => {
    clearTimeout(notificationTimer)
    dispatch({ type: 'SET', payload: message })
    notificationTimer = setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={[notification, notify]}>
      {children}
    </NotificationContext.Provider>
  )
}

const useNotificationValue = () => useContext(NotificationContext)[0]
const useNotify = () => useContext(NotificationContext)[1]

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) {
    return null
  }

  return <div>{notification}</div>
}

const App = () => {
  const queryClient = useQueryClient()
  const notify = useNotify()
  const anecdotes = useQuery({
    queryKey: ['anecdotes'],
    queryFn: async () => (await fetch('http://localhost:3001/anecdotes')).json(),
  })
  const createMutation = useMutation({
    mutationFn: async content => {
      const response = await fetch('http://localhost:3001/anecdotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, votes: 0 }),
      })
      return await response.json()
    },
    onSuccess: newAnecdote => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`anecdote '${newAnecdote.content}' created`)
    },
  })

  if (anecdotes.isPending) return <div>loading data...</div>

  const addAnecdote = event => {
    event.preventDefault()
    createMutation.mutate(event.target.anecdote.value)
    event.target.reset()
  }

  return (
    <div>
      <Notification />
      <h2>Anecdotes</h2>
      {anecdotes.data.map(anecdote => <div key={anecdote.id}>{anecdote.content}</div>)}
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
