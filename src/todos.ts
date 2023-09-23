export type Todo = {
  id: number
  content: string
  completed: boolean
  date: Date | number
}

export let todos = [] as Array<Todo>
