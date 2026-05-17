import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAnecdotes = async () => (await fetch(baseUrl)).json()

const createAnecdote = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })
  return await response.json()
}

const updateAnecdote = async (anecdote) => {
  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })
  return await response.json()
}

const App = () => {
  const queryClient = useQueryClient()
  const result = useQuery({ queryKey: ['anecdotes'], queryFn: getAnecdotes })
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

  const vote = anecdote => {
    updateMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const addAnecdote = event => {
    event.preventDefault()
    createMutation.mutate(event.target.anecdote.value)
    event.target.reset()
  }

  if (result.isPending) return <div>loading data...</div>

  const anecdotes = result.data.toSorted((first, second) => second.votes - first.votes)

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
