import 'source-map-support/register'
import {getUserId} from '../utils'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import {updateTodo, todoExists} from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  console.log('UpdateTodo ',todoId)
  const userId = getUserId(event)
  console.log('getUserId(event)', userId)

  //impelement exists
  const todovalid=await todoExists(userId, todoId)
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
  const result=await updateTodo(updatedTodo,userId, todoId)
  console.log(result)
  
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
    
  }

 
}










/*import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {getUserId} from '../utils'


const todoTable= process.env.TODO_TABLE
//const todoIdIndex = process.env.TODO_ID_INDEX
const docClient = new AWS.DynamoDB.DocumentClient()

export const handler= middy ( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoIdp = event.pathParameters.todoId
    console.log('Update todoIdp ',todoIdp)
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    console.log('updatedTodo, ', updatedTodo)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
   // const todoIdValidation = await todoExists(todoId)
/*
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

    // const result = await docClient.update({
    //   TableName: todoTable,
    //   //IndexName : todoIdIndex
    //   Key: {
    //    id: todoId
    //   },
    //   /////////
    //   UpdateExpression: "set name= :name, dueDate= :dueDate, done= :done",
    //   ExpressionAttributeValues: {
    //     ":name": updatedTodo.name,
    //     ":dueDate": updatedTodo.dueDate,
    //     ":done":updatedTodo.done
    // } }).promise()
    // console.log('update result: ', result)

    /*
    console.log('getUserId(event)', getUserId(event))
    await docClient.update({
      TableName: todoTable,  
      Key: {
        todoId: todoIdp,
        userId: getUserId(event)
        
      },
      UpdateExpression: 'set #name = :name, #dueDate = :duedate, #done = :d', 
      ExpressionAttributeValues: {
          ':name': updatedTodo.name,
          ':duedate': updatedTodo.dueDate,
          ':d': updatedTodo.done
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
    }
    }).promise()
*/


//call u
//call update function 
//send user id, todoid , update request.
/*
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
)*/
