import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { todoExists, getUploadUrl } from '../fileStorage/attachmentUtils.mjs'
import { getUserId } from '../auth/utils.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('generateUploadUrl')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credntials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing event: ', event)
    const imageId = event.pathParameters.groupId
    const validGroupId = await todoExists(groupId)
    const newTodo = JSON.parse(event.body)

    if (!validTodoId) {
      return {
        statusCode: 404,
        body: JSON.stringify({
        error: 'Todo does not exist'
      })
      }
    }
    
    const imageId = uuidv4()

    const url = await getUploadUrl(imageId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  })

