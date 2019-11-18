import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getUserId } from '../utils'
import {userExists, getAllTodos} from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  
  logger.info('Processing event: ', event)
  const userId = getUserId(event)
  logger.info(' user Id: ', userId )
  
  const validUserId= await userExists(userId)
  if (!validUserId){
  return {
    statusCode: 404, 
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      error: 'There are no todo items for this user'
    })
  }
  }

  const todos = await getAllTodos(userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: todos
    })
  }
}
