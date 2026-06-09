import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { deleteTodo } from '../businessLogic/todos.mjs'
import { getUserId } from '../auth/utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('deleteTodo')


export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credntials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing event: ', event)
    const todoId = event.pathParameters.todoId
    
    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)
    const deleteItem = await deleteTodo(todoId, userId)

    return {
      statusCode: 204,
      body:{}
    }
  })
