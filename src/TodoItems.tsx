import { Fragment } from 'hono/jsx'
import { Todo, todos } from './todos'

const formatedate = (date: Date | number) => {
  if (typeof date === 'number') date = new Date(date)

  return date.toLocaleDateString('en-us', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

const TodoItem = (props: { todo: Todo }) => (
  <article id={`todo-item-${props.todo.id}`}>
    <hgroup>
      <p>
        <small>Created on {formatedate(props.todo.date)}</small>
      </p>
    </hgroup>
    {props.todo.completed ? (
      <h4>
        <s>{props.todo.content}</s>
      </h4>
    ) : (
      <h4>{props.todo.content}</h4>
    )}
    <footer style="display: flex; gap: 1rem;">
      <button
        class="outline"
        hx-put={`/html/todo/${props.todo.id}`}
        hx-target="closest section"
        hx-swap="innerHTML"
      >
        {props.todo.completed ? 'Undone' : 'Mark as done'}
      </button>
      <button
        class="outline error"
        hx-delete={`/html/todo/${props.todo.id}`}
        hx-target="closest section"
        hx-swap="innerHTML swap:600ms"
        _={`on click set my innerHTML to 'Deleting...' then add .removing to <article#todo-item-${props.todo.id}/>`}
      >
        Delete
      </button>
    </footer>
  </article>
)

const TodoItems = (props: { todos: Array<Todo> }) =>
  todos.length > 0 ? (
    <Fragment>
      <hgroup>
        <h5>Things to do</h5>
        <p>
          {props.todos.filter((todo) => todo.completed).length} completed &nbsp;
          &nbsp;
          {props.todos.filter((todo) => !todo.completed).length} left
        </p>
      </hgroup>
      {props.todos.map((todo) => (
        <TodoItem todo={todo} />
      ))}
    </Fragment>
  ) : (
    <article>You have nothing to do 🥳</article>
  )

export default TodoItems
