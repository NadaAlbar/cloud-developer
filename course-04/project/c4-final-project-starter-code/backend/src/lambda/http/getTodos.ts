import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
//import * as AWS  from 'aws-sdk'
import { getUserId } from '../utils'
import {userExists, getAllTodos} from '../../businessLogic/todos'

//const docClient = new AWS.DynamoDB.DocumentClient()
//const usersTable = process.env.USERS_TABLE
//const ToDoTable = process.env.TODO_TABLE
//const todoIdIndex = process.env.TODO_ID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  
  console.log('Processing event: ', event)
  const userId = getUserId(event)
  console.log(' user Id: ', userId )
  
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

/*
async function userExists(userId: string){
  const result = await docClient.get({
    TableName: ToDoTable,
    Key:{
      userId: userId
    }
  }).promise()
  console.log('get user: ', result)
  return !!result.Item
}
*/
/*
async function getTodosforUserId(userId: string){
  const result = await docClient.query({
    TableName: ToDoTable,
    //IndexName: todoIdIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues:{
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise()

  return result.Items
}*/