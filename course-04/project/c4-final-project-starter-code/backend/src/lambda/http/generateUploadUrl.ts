import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import * as uuid from 'uuid'
import {getUserId} from '../utils'
import {createImageUrl, saveImageUrl,todoExists } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

//const docClient = new AWS.DynamoDB.DocumentClient()
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('auth')

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

//const UsersTable = process.env.USERS_TABLE
//const TodoTable = process.env.TODO_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId= event.pathParameters.todoId
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  //get userid 
  const userId=getUserId(event)
  logger.info(' getUserId ', userId)

  const vallidTodo = await todoExists(userId,todoId) 
  if (!vallidTodo){
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'todo item does not exist'
      })
    }
  }

  

  const imageId = uuid.v4()
  const newImage =  await createImageUrl(imageId)//this will be saved to the DB
  saveImageUrl (userId,todoId,newImage)
  const signedurl = getUploadUrl(imageId)

  // await docClient.update({
  //   TableName: TodoTable,  //****** 
  //   Key: {
  //     todoId: todoIdparam,
  //     userId: getUserId(event)
      
  //   },
  //   UpdateExpression: 'set #attachmentUrl = :attachmentUrl', /*** */
  //   ExpressionAttributeValues: {
  //       ':attachmentUrl': newImage
        
  //   },
  //   ExpressionAttributeNames: {
  //     '#attachmentUrl': 'attachmentUrl'
  // }
  // }).promise()
  
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


// async function createImage(imageId: string){
//   console.log('creating new Image ')
//   const imageUrl= `https://${bucketName}.s3.amazonaws.com/${imageId}`
//   //put in db......
//   return imageUrl

// }


function getUploadUrl(imageId: string) {
  logger.info('Getting a SignedUrl')
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  })
}
