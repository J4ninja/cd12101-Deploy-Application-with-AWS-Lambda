import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('attachmentUtils')

const dynamoDb = AWSXRay.captureAWSv3Client(new DynamoDB())
const dynamoDbClient = DynamoDBDocument.from(dynamoDb)
const s3Client = new S3Client()

const todosTable = process.env.TODOS_TABLE
const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)


async function todoExists(todoId) {
  const result = await dynamoDbClient.get({
    TableName: groupsTable,
    Key: {
      id: todoId
    }
  })

  logger.info('Get todo: ', result)
  return !!result.Item
}

async function createImage(todoId, imageId, event) {
  const timestamp = new Date().toISOString()
  const newImage = JSON.parse(event.body)

  const newItem = {
    todoId,
    timestamp,
    imageId,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`,
    ...newImage
  }
  logger.info('Storing new item: ', newItem)

  await dynamoDbClient.put({
    TableName: imagesTable,
    Item: newItem,
  })

  return newItem
}

async function getUploadUrl(imageId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: imageId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
  return url
}