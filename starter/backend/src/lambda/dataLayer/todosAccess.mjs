// code derived from https://github.com/udacity/cd12101-lesson-demos-and-exercise-starters-solutions

import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('todosAccess')

export class TodosAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE,
    todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.todosCreatedAtIndex = todosCreatedAtIndex
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
  }

  async getAllTodos(userId) {
    logger.info('Getting all todos')

    const result = await this.dynamoDbClient.query({
      TableName: this.todosTable,
      IndexName: this.todosCreatedAtIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: true
    })

    return result.Items
  }

  async createTodo(todo) {
    logger.info(`Creating a todo with id ${todo.todoId}`)

    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }

  async deleteTodo(todo) {
    logger.info(`Deleting a todo with id ${todo.todoId}`)

    const { todoId, userId } = todo
    await this.dynamoDbClient.delete({
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    })

    return todo
  }

  async updateTodo(todoId, userId, updatedTodo) {
    logger.info(`Updating a todo with id ${todoId} for user ${userId}`)

    const result = await this.dynamoDbClient.update({
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name' // "name" is a DynamoDB reserved keyword, so it requires an alias
      },
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done
      },
      ReturnValues: 'ALL_NEW'
    })

    return result.Attributes
  }

  async updateAttachmentUrl(todoId, userId, attachmentUrl) {
  logger.info(`Updating attachment URL for todo ${todoId} for user ${userId}`)

  await this.dynamoDbClient.update({
    TableName: this.todosTable,
    Key: {
      userId: userId,
      todoId: todoId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    }
  })
}
}
