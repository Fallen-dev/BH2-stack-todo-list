import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { validator } from 'hono/validator'
import { todos } from './todos'
import TodoItems from './TodoItems'

let count = 0

const html = new Hono()
html.get('/todos', (ctx) => ctx.html(<TodoItems todos={todos} />))

html.post(
  '/todos',
  validator('form', (value, ctx) => {
    const content = value['input'] as string

    if (content.startsWith(' ')) {
      return ctx.text('Cannot add an empty string', 400)
    }
    return { content }
  }),
  (ctx) => {
    const { content } = ctx.req.valid('form')
    todos.unshift({ id: ++count, content, completed: false, date: new Date() })
    return ctx.html(<TodoItems todos={todos} />)
  },
)

html.put('/todo/:id', (ctx) => {
  const todo = todos.find((todo) => todo.id === +ctx.req.param('id'))
  if (!todo) {
    return ctx.text('ID does not match', 400)
  }
  todo.completed = !todo.completed

  return ctx.html(<TodoItems todos={todos} />)
})

html.delete('/todo/:id', (ctx) => {
  const todo = todos.find((todo) => todo.id === +ctx.req.param('id'))
  if (!todo) {
    return ctx.text('ID does not match', 400)
  }
  todos.splice(todos.indexOf(todo), 1)
  return ctx.html(<TodoItems todos={todos} />)
})

const app = new Hono()

app.use('/', serveStatic({ root: './src' }))

app.route('/html', html)

app.get('/todos', (ctx) => ctx.json({ todos }))

export default app
