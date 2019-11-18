import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
//import { updateTodo } from '../businessLogic/todos'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'


const logger = createLogger('auth')

const XAWS = AWSXRay.captureAWS(AWS)

export class accessTodos {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly UsersTable = process.env.USERS_TABLE,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly ToDoTable = process.env.TODO_TABLE) { //*
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Accessing all todos for the current user')

    const result = await this.docClient.query({
        TableName: this.ToDoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues:{
          ':userId': userId
        },
        ScanIndexForward: false
      }).promise()
    
    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info('Saving a todo item for the current user')

    await this.docClient.put({
      TableName: this.ToDoTable,
      Item: todo
    }).promise()

    return todo
  }


  // implement todoExists/update/delete/createImageUrl 

  async updateTodo(updateTodoRequest: UpdateTodoRequest, userId: string, todoIdP: string){
    logger.info('Updating todos item for the current user')

    await this.docClient.update({
      TableName: this.ToDoTable,  //****** 
      Key: {
        todoId: todoIdP,
        userId: userId
        
      },
      UpdateExpression: 'set #name = :name, #dueDate = :duedate, #done = :d', /*** */
      ExpressionAttributeValues: {
          ':name': updateTodoRequest.name,
          ':duedate': updateTodoRequest.dueDate,
          ':d': updateTodoRequest.done
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
    }
    }).promise()

    return '' 
  }

  async deleteTodo( userId: string,todoId: string){
    logger.info('Deleting todos item for the current user')

    await this.docClient.delete({
      TableName: this.ToDoTable,  //****** 
      Key: {
        todoId: todoId,
        userId: userId
        
      },
      ConditionExpression: "todoId = :val",
      ExpressionAttributeValues: {
        ":val": todoId
    }
    }).promise()
    return 'deleted' 
  }

  async  createImageUrl(imageId: string){
    logger.info('creating new Image ')
    const imageUrl= `https://${this.bucketName}.s3.amazonaws.com/${imageId}`
    //put in db......
    return imageUrl
    
  }

  async saveImageUrl(userId:string, todoId: string, newImage: string){
  logger.info('Updating attachments url ')
  await this.docClient.update({
    TableName: this.ToDoTable,  //****** 
    Key: {
      todoId: todoId,
      userId: userId
    },
    UpdateExpression: 'set #attachmentUrl = :attachmentUrl', /*** */
    ExpressionAttributeValues: {
        ':attachmentUrl': newImage    
    },
    ExpressionAttributeNames: {
      '#attachmentUrl': 'attachmentUrl'
  }
  }).promise()
  
  return ''
  }

  async todoExists(userId: string,todoId: string){
    logger.info('Checking if todo item exists in the database')
    const result = await this.docClient.get({
      TableName: this.ToDoTable,
      Key:{
        userId: userId,
        todoId:todoId
      }
    }).promise()
    logger.info('get items: ', result)
    return !!result.Item
  }


  async userExists(userId: string){
    logger.info('Check if user exists in the database')
    const result = await this.docClient.get({
      TableName: this.UsersTable ,
      Key:{
        id: userId
      }
    }).promise()
    logger.info('get user: ', result)
    return !!result.Item
  }
 
}




function createDynamoDBClient() {
  logger.info('Create DynamoDb instance')
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
