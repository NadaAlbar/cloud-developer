import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import * as uuid from 'uuid'
import {getUserId} from '../utils'

//const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

//const UsersTable = process.env.USERS_TABLE
//const TodoTable = process.env.TODO_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoIdparam = event.pathParameters.todoId
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  //get userid 
  const userid=getUserId(event)
  console.log(' getUserId ', userid)
  console.log(' Adding image to To-Do item: ',todoIdparam)
/*
  const vallidTodo = await todoExists(todoIdparam, userid) 
  if (!vallidTodo){
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'todo item does not exist'
      })
    }
  }*/

  const imageId = uuid.v4()
  const newImage =  await createImage (imageId)//this will be saved to the DB
  
  console.log('newImage - create Image(): ', newImage)


  const signedurl = getUploadUrl(imageId)

  
    return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl: signedurl
    })
  }
})


handler.use(
  cors({
    credentials: true
  })
)


/*
async function todoExists(todoIdparam : string, userid: string){
  const result = await docClient
    .get({
      TableName: TodoTable,
      Key: {
        todoId: todoIdparam, 
        userId: userid
      }
    })
    .promise()

  console.log('Get group: ', result)
  return !!result.Item
}

*/


async function createImage(imageId: string){
  console.log('creating new Image ')
  const imageUrl= `https://${bucketName}.s3.amazonaws.com/${imageId}`
  //put in db......
  return imageUrl
}


function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  })
}
