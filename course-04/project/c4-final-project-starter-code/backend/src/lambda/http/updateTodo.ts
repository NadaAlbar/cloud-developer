import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const todoTable= process.env.TODO_TABLE
//const todoIdIndex = process.env.TODO_ID_INDEX
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler= middy ( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    console.log('Update todo: id: ',todoId)
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
  
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const todoIdValidation = await todoExists(todoId)

    if(!todoIdValidation){
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
/*
    const updatedItem = {
      done: updatedTodo.done,
      name: updatedTodo.name,
      dueDate: updatedTodo.dueDate
      
    }
*/    
    docClient.update({
      TableName: todoTable,
      Key: {
        id: todoId,
       TODO_ID_INDEX : todoIdIndex,
      },
      /////////
      UpdateExpression: "set name= :name, dueDate= :dueDate, done= :done",
      ExpressionAttributeValues: {
        ":name": updatedTodo.name,
        ":dueDate": updatedTodo.dueDate,
        ":done":updatedTodo.done
    }
      })
  
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
      
    }
  }
  
)//middy end

handler.use(
  cors({
    credential:true
  })
)

async function todoExists(todoId: string){
    const result = await docClient.get({
      TableName: todoTable,
      Key: {
        id: todoId
      }
    }).promise()
    console.log(' Get Todo, ',result)

    return !!result.Item
}