import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

export class TodosAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE
  ) {
    this.documentClient = documentClient
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
  }

  async getAllTodoss() {
    console.log('Getting all todos')

    // const result = await this.dynamoDbClient.scan({
    //   TableName: this.todosTable
    // })
    const result = await this.dynamoDbClient.query({
      TableName: this.todosTable,
      IndexName: this.indexName,
      KeyConditionExpression: 'paritionKey = :paritionKey',
        ExpressionAttributeValues: {
        ':paritionKey': partitionKeyValue
        }
    })

    return result.Items
  }

  async createTodos(todo) {
    console.log(`Creating a todo with id ${todo.id}`)

    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }

  async deleteTodos(todo) {
    console.log(`Deleting a todo with id ${todo.id}`)

    await this.dynamoDbClient.delete({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }

  async updateTodos(todo) {
    console.log(`Updating a todo with id ${todo.id}`)

    await this.dynamoDbClient.update({
      TableName: this.todosTable,
      Item: todo
    })

    return todo
  }
}
