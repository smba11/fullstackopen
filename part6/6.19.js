import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) throw new Error('anecdote service failed')
  return await response.json()
}

const createAnecdote = async content => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })
  if (!response.ok) throw new Error('failed to create anecdote')
  return await response.json()
}

const updateAnecdote = async anecdote => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })
  if (!response.ok) throw new Error('failed to update anecdote')
  return await response.json()
}

const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: ['anecdotes'], queryFn: getAnecdotes, retry: false })

  const createMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: newAnecdote => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: updatedAnecdote => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map(anecdote => anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote)
      )
    },
  })

  return {
    query,
    create: content => createMutation.mutate(content),
    vote: anecdote => updateMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }),
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

  const anecdotes = query.data.toSorted((first, second) => second.votes - first.votes)

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
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

export default App
