import 'source-map-support/register'
//import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserId} from '../utils'
import {deleteTodo, todoExists} from '../../businessLogic/todos'


//const todoTable= process.env.TODO_TABLE
//const todoIdIndex = process.env.TODO_ID_INDEX
//const docClient = new AWS.DynamoDB.DocumentClient()


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Remove a TODO item by id
  const todoIdp = event.pathParameters.todoId
    console.log('Delete todoIdp ',todoIdp)
    const userId = getUserId(event)
    console.log('getUserId(event)', userId)

    //impelement exists
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
    console.log(result)
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
      
    }

    // await docClient.delete({
    //   TableName: todoTable,  //****** 
    //   Key: {
    //     todoId: todoIdp,
    //     userId: getUserId(event)
        
    //   },
    //   ConditionExpression: "todoId = :val",
    //   ExpressionAttributeValues: {
    //     ":val": todoIdp
    // }
    // }).promise()

  


  ///impelement if Exists
}
