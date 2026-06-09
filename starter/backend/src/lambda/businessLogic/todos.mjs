import * as uuid from 'uuid'

import { TodoAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodoAccess()

const todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX

export async function getAllTodos() {
  return todoAccess.getAllTodos()
}

export async function createTodo(createTodoRequest, userId) {
  const itemId = uuid.v4()

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    createdAt: todosCreatedAtIndex,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate
  })
}

export async function deleteTodo(deleteTodoId, userId) {

  return await todoAccess.deleteTodo({
    todoId: deleteTodoId,
    userId: userId
  })
}

export async function updateTodo(updateTodoRequest, userId) {

  return await todoAccess.updateTodo({
    todoId: updateTodoRequest.todoId,
    userId: userId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}
