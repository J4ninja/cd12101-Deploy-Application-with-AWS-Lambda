import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

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
    console.log('Getting all todos')

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
    console.log(`Creating a todo with id ${todo.id}`)

    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }

  async deleteTodo(todo) {
    console.log(`Deleting a todo with id ${todo.id}`)

    await this.dynamoDbClient.delete({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }

  async updateTodo(todo) {
    console.log(`Updating a todo with id ${todo.id}`)

    await this.dynamoDbClient.update({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }
}
