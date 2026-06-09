import * as uuid from 'uuid'

import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodosAccess()

export async function getAllTodos(userId) {
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(createTodoRequest, userId) {
  const itemId = uuid.v4()

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    createdAt: new Date().toISOString(),
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
