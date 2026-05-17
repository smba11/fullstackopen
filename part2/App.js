import { useState, useEffect } from 'react'
import axios from 'axios'

const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={error ? 'error' : 'success'}>
      {message}
    </div>
  )
}

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:
        <input value={newName} onChange={handleNameChange} />
      </div>

      <div>
        number:
        <input value={newNumber} onChange={handleNumberChange} />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map(person => (
        <p key={person.id}>
          {person.name} {person.number}

          <button onClick={() => deletePerson(person.id, person.name)}>
            delete
          </button>
        </p>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const showMessage = (text, isError = false) => {
    setMessage(text)
    setError(isError)

    setTimeout(() => {
      setMessage(null)
      setError(false)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name === newName
    )

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber
        }

        axios
          .put(
            `http://localhost:3001/persons/${existingPerson.id}`,
            updatedPerson
          )
          .then(response => {
            setPersons(
              persons.map(person =>
                person.id !== existingPerson.id
                  ? person
                  : response.data
              )
            )

            showMessage(`Updated ${response.data.name}`)

            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            showMessage(
              `Information of ${existingPerson.name} has already been removed from server`,
              true
            )

            setPersons(
              persons.filter(
                person => person.id !== existingPerson.id
              )
            )
          })
      }

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    axios
      .post('http://localhost:3001/persons', personObject)
      .then(response => {
        setPersons(persons.concat(response.data))

        showMessage(`Added ${response.data.name}`)

        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      axios
        .delete(`http://localhost:3001/persons/${id}`)
        .then(() => {
          setPersons(
            persons.filter(person => person.id !== id)
          )

          showMessage(`Deleted ${name}`)
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} error={error} />

      <Filter
        filter={filter}
        handleFilterChange={(event) =>
          setFilter(event.target.value)
        }
      />

      <h2>Add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(event) =>
          setNewName(event.target.value)
        }
        newNumber={newNumber}
        handleNumberChange={(event) =>
          setNewNumber(event.target.value)
        }
      />

      <h2>Numbers</h2>

      <Persons
        persons={personsToShow}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App