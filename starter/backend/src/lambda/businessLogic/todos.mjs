
// code derived from https://github.com/udacity/cd12101-lesson-demos-and-exercise-starters-solutions

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
    dueDate: createTodoRequest.dueDate,
    done: false
  })
}

export async function deleteTodo(deleteTodoId, userId) {

  return await todoAccess.deleteTodo({
    todoId: deleteTodoId,
    userId: userId
  })
}


export async function updateTodo(todoId, updateTodoRequest, userId) { 
  return await todoAccess.updateTodo({
    todoId: todoId, 
    userId: userId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}

export async function updateAttachmentUrl(todoId, userId) {
  const bucketName = process.env.IMAGES_S3_BUCKET
  const attachmentUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
  
  return await todoAccess.updateAttachmentUrl(todoId, userId, attachmentUrl)
}