import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) throw new Error('anecdote service failed')
  return await response.json()
}

const createAnecdote = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })

  if (!response.ok) throw new Error('failed to create anecdote')

  return await response.json()
}

const App = () => {
  const queryClient = useQueryClient()
  const result = useQuery({ queryKey: ['anecdotes'], queryFn: getAnecdotes, retry: false })
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: newAnecdote => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
  })

  const addAnecdote = event => {
    event.preventDefault()
    newAnecdoteMutation.mutate(event.target.anecdote.value)
    event.target.reset()
  }

  if (result.isPending) return <div>loading data...</div>
  if (result.isError) return <div>anecdote service not available due to problems in server</div>

  return (
    <div>
      <h2>Anecdotes</h2>
      {result.data.map(anecdote =>
        <div key={anecdote.id}>
          {anecdote.content} has {anecdote.votes}
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
