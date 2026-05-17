import { createContext, useContext, useReducer } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const NotificationContext = createContext()

const reducer = (state, action) => {
  if (action.type === 'SET') return action.payload
  if (action.type === 'CLEAR') return null
  return state
}

let timer

const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(reducer, null)

  const notify = message => {
    clearTimeout(timer)
    dispatch({ type: 'SET', payload: message })
    timer = setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  return (
    <NotificationContext.Provider value={[notification, notify]}>
      {children}
    </NotificationContext.Provider>
  )
}

const useNotification = () => useContext(NotificationContext)

const Notification = () => {
  const [notification] = useNotification()
  return notification ? <div>{notification}</div> : null
}

const App = () => {
  const queryClient = useQueryClient()
  const [, notify] = useNotification()
  const result = useQuery({
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

      if (!response.ok) {
        throw new Error('too short anecdote, must have length 5 or more')
      }

      return await response.json()
    },
    onSuccess: newAnecdote => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`anecdote '${newAnecdote.content}' created`)
    },
    onError: error => {
      notify(error.message)
    },
  })

  if (result.isPending) return <div>loading data...</div>

  const addAnecdote = event => {
    event.preventDefault()
    createMutation.mutate(event.target.anecdote.value)
    event.target.reset()
  }

  return (
    <div>
      <Notification />
      {result.data.map(anecdote => <div key={anecdote.id}>{anecdote.content}</div>)}
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

const Root = () => (
  <NotificationProvider>
    <App />
  </NotificationProvider>
)

export default Root
