import { useQuery } from '@tanstack/react-query'

const getAnecdotes = async () => {
  const response = await fetch('http://localhost:3001/anecdotes')

  if (!response.ok) {
    throw new Error('anecdote service failed')
  }

  return await response.json()
}

const App = () => {
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  })

  if (result.isPending) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>has {anecdote.votes}</div>
        </div>
      )}
    </div>
  )
}

export default App
