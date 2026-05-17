import { create } from 'zustand'

const useFeedbackStore = create(set => ({
  good: 0,
  ok: 0,
  bad: 0,
  actions: {
    voteGood: () => set(state => ({ good: state.good + 1 })),
    voteOk: () => set(state => ({ ok: state.ok + 1 })),
    voteBad: () => set(state => ({ bad: state.bad + 1 })),
    reset: () => set({ good: 0, ok: 0, bad: 0 }),
  },
}))

const useFeedback = () => useFeedbackStore(state => ({
  good: state.good,
  ok: state.ok,
  bad: state.bad,
}))

const useFeedbackActions = () => useFeedbackStore(state => state.actions)

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = () => {
  const { good, ok, bad } = useFeedback()
  const all = good + ok + bad

  if (all === 0) {
    return <p>No feedback given</p>
  }

  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="ok" value={ok} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={`${positive} %`} />
      </tbody>
    </table>
  )
}

const App = () => {
  const { voteGood, voteOk, voteBad, reset } = useFeedbackActions()

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={voteGood} text="good" />
      <Button onClick={voteOk} text="ok" />
      <Button onClick={voteBad} text="bad" />
      <Button onClick={reset} text="reset" />
      <h1>statistics</h1>
      <Statistics />
    </div>
  )
}

export default App
