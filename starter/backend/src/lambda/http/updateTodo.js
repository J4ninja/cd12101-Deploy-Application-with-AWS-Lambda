import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../businessLogic/todos.mjs'
import { getUserId } from '../auth/utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('updateTodo')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing event: ', event)
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)
  
    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)
    const updateItem = await updateTodo(updatedTodo, userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        updateItem
      })
    }
  })
