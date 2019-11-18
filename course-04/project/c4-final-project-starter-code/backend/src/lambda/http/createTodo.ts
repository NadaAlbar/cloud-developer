import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body) //name , dueDate

  // TODO: Implement creating a new TODO item

  logger.info('Processing event: ', event)
  const userId= getUserId(event)
  logger.info('Creating todo item for user: ',userId)

   const item= await createTodo(newTodo,userId)
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item
    })
  }
}
