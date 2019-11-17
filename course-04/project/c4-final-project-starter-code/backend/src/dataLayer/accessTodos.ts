import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'



const XAWS = AWSXRay.captureAWS(AWS)

export class accessTodos {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly ToDoTable = process.env.TODO_TABLE) { //*
  }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos for the current user')

    const result = await this.docClient.query({
        TableName: this.ToDoTable,
        //IndexName: todoIdIndex,
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
    await this.docClient.put({
      TableName: this.ToDoTable,
      Item: todo
    }).promise()

    return todo
  }


  // implement todoExists/update/delete here!
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
