import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserId} from '../utils'
import {deleteTodo, todoExists} from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Remove a TODO item by id
  const todoIdp = event.pathParameters.todoId
  logger.info('Delete todoIdp ',todoIdp)
  const userId = getUserId(event)
  logger.info('getUserId(event)', userId)

    const todovalid=await todoExists(userId, todoIdp)
    if(!todovalid){
      return {
        statusCode:404,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body:JSON.stringify({
          error: 'ToDo item does not exist'
        })
      }
      
    }
    const result=await deleteTodo(userId, todoIdp)
    logger.info(result)
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
      
    }

}
