import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserId} from '../utils'


const todoTable= process.env.TODO_TABLE
//const todoIdIndex = process.env.TODO_ID_INDEX
const docClient = new AWS.DynamoDB.DocumentClient()


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Remove a TODO item by id
  const todoIdp = event.pathParameters.todoId
    console.log('Delete todoIdp ',todoIdp)
    console.log('getUserId(event)', getUserId(event))
  

    await docClient.delete({
      TableName: todoTable,  //****** 
      Key: {
        todoId: todoIdp,
        userId: getUserId(event)
        
      },
      ConditionExpression: "todoId = :val",
      ExpressionAttributeValues: {
        ":val": todoIdp
    }
     
    }).promise()

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: 'Deleted'
    
  }


  ///impelement if Exists
}
