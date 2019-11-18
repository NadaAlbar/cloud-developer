import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import * as AWS  from 'aws-sdk'
import { getUserId } from '../utils'
import { createTodo } from '../../businessLogic/todos'
//import {parseUserId} from '../../auth/utils'



//const docClient = new AWS.DynamoDB.DocumentClient()
//const ToDoTable = process.env.TODO_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body) //name , dueDate

  // TODO: Implement creating a new TODO item

  console.log('Processing event: ', event)
  const userId= getUserId(event)
  console.log('Creating todo item for user: ',userId )

   const item= await createTodo(newTodo,userId)
  /*
  const itemId = uuid.v4()
  const timestamp = new Date().toISOString()
  
  const newItem = {
    todoId: itemId,
    userId: getUserId(event),//parseUserId(token) ,
    done: false,
    createdAt: timestamp,
    ...newTodo, //name + dueDate
    attachmentUrl:'no URL yet'
  }

  await docClient.put({
    TableName: ToDoTable,
    Item: newItem
  }).promise()
  */
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
