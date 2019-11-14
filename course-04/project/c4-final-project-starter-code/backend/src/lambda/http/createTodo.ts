import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as AWS  from 'aws-sdk'
import { getUserId } from '../utils'
//import {parseUserId} from '../../auth/utils'



const docClient = new AWS.DynamoDB.DocumentClient()
const ToDoTable = process.env.TODO_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body) //name , dueDate

  // TODO: Implement creating a new TODO item

  console.log('Processing event: ', event)
  console.log('UserId', getUserId(event))
  const itemId = uuid.v4()
  const timestamp = new Date().toISOString()
  /*
   //getUserId implementation:
  const authHeader = event.headers.Authorization
  const split = authHeader.split(' ')
  const token = split[1]
  */
  //const userId = parseUserId(jwtToken)

  const newItem = {
    id: itemId,
    userId: getUserId(event),//parseUserId(token) ,
    done: false,
    createdAt: timestamp,
    ...newTodo, //name
    attachmentUrl:'no URL yet'
  }

  await docClient.put({
    TableName: ToDoTable,
    Item: newItem
  }).promise()
  
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
    id: itemId,
    done: false,
    createdAt: timestamp,
    ...newTodo, //name +dueDate
    attachmentUrl:'no URL yet'
    })
  }
}
