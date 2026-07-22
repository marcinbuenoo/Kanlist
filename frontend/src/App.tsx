import { useMemo, useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'

type CardStatus = 'todo' | 'doing' | 'done'

type KanbanCard = {
  id: number
  title: string
  description: string
  status: CardStatus
}

const initialCards: KanbanCard[] = [
  {
    id: 1,
    title: 'Draft roadmap',
    description: 'Outline the first version of the product flow.',
    status: 'todo',
  },
  {
    id: 2,
    title: 'Review landing section',
    description: 'Polish the CTA and the hero copy.',
    status: 'doing',
  },
  {
    id: 3,
    title: 'Ship MVP demo',
    description: 'Present the demo to the team and collect feedback.',
    status: 'done',
  },
]

const columns: { key: CardStatus; label: string }[] = [
  { key: 'todo', label: 'To do' },
  { key: 'doing', label: 'In progress' },
  { key: 'done', label: 'Done' },
]

function App() {
  const [cards, setCards] = useState(initialCards)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<CardStatus>('todo')
  const [draggedCardId, setDraggedCardId] = useState<number | null>(null)

  const todoList = useMemo(
    () => cards.filter((card) => card.status !== 'done'),
    [cards],
  )

  const doingCount = cards.filter((card) => card.status === 'doing').length
  const doneCount = cards.filter((card) => card.status === 'done').length

  const addCard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title.trim()) {
      return
    }

    setCards((currentCards) => [
      {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        status,
      },
      ...currentCards,
    ])

    setTitle('')
    setDescription('')
    setStatus('todo')
  }

  const moveCard = (cardId: number, nextStatus: CardStatus) => {
    setCards((currentCards) =>
      currentCards.map((card) =>
        card.id === cardId ? { ...card, status: nextStatus } : card,
      ),
    )
  }

  const completeTask = (cardId: number) => {
    moveCard(cardId, 'done')
  }

  const onDragStart = (cardId: number, event: React.DragEvent<HTMLElement>) => {
    setDraggedCardId(cardId)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(cardId))
  }

  const onDragEnd = () => {
    setDraggedCardId(null)
  }

  return (
    <div className="app-shell">
      <header className="app-header hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Kanlist</p>
          <h1>Modern kanban flow</h1>
          <p className="hero-text">
            A cleaner front-end MVP where cards become tasks, tasks become progress,
            and the board stays smooth to use.
          </p>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-value">{cards.length}</span>
            <span className="stat-label">Total cards</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{todoList.length}</span>
            <span className="stat-label">Active tasks</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{doingCount}</span>
            <span className="stat-label">In motion</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{doneCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </header>

      <main className="app-grid">
        <Card className="panel-card">
          <CardHeader>
            <CardTitle>Add a new card</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="task-form" onSubmit={addCard}>
              <label>
                <span>Title</span>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Create the list view"
                />
              </label>

              <label>
                <span>Description</span>
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the task and the expected outcome"
                />
              </label>

              <label>
                <span>Column</span>
                <select
                  className="select-input"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as CardStatus)}
                >
                  {columns.map((column) => (
                    <option key={column.key} value={column.key}>
                      {column.label}
                    </option>
                  ))}
                </select>
              </label>

              <Button type="submit">Create card</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="panel-card">
          <CardHeader>
            <CardTitle>To-do list</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="todo-list">
              {todoList.length === 0 ? (
                <p className="empty-state">No active tasks right now.</p>
              ) : (
                todoList.map((card) => (
                  <article className="todo-item" key={card.id}>
                    <div>
                      <strong>{card.title}</strong>
                      <p>{card.description || 'No description added yet.'}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => completeTask(card.id)}>
                      Mark done
                    </Button>
                  </article>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <section className="board-grid">
        {columns.map((column) => {
          const columnCards = cards.filter((card) => card.status === column.key)

          return (
            <Card className="board-column" key={column.key}>
              <CardHeader>
                <CardTitle>
                  <span className="column-title">{column.label}</span>
                  <span className="column-count">{columnCards.length}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="column-list"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault()

                    const droppedCardId = Number(
                      event.dataTransfer.getData('text/plain') || draggedCardId,
                    )

                    if (!Number.isNaN(droppedCardId)) {
                      moveCard(droppedCardId, column.key)
                    }

                    setDraggedCardId(null)
                  }}
                >
                  {columnCards.map((card) => (
                    <article
                      className={`kanban-card ${draggedCardId === card.id ? 'dragging' : ''}`}
                      key={card.id}
                      draggable
                      onDragStart={(event) => onDragStart(card.id, event)}
                      onDragEnd={onDragEnd}
                    >
                      <div className="card-head">
                        <h3>{card.title}</h3>
                        <span className="status-pill">{column.label}</span>
                      </div>
                      <p>{card.description || 'No description added yet.'}</p>

                      <div className="card-actions">
                        {column.key !== 'todo' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => moveCard(card.id, 'todo')}
                          >
                            Back to todo
                          </Button>
                        )}
                        {column.key !== 'doing' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveCard(card.id, 'doing')}
                          >
                            In progress
                          </Button>
                        )}
                        {column.key !== 'done' && (
                          <Button size="sm" onClick={() => completeTask(card.id)}>
                            Done
                          </Button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>
    </div>
  )
}

export default App
