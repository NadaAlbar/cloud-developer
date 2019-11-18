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

const logger = createLogger('auth')
const XAWS = AWSXRay.captureAWS(AWS)


const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId= event.pathParameters.todoId
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
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
  const newImage =  await createImageUrl(imageId)
  saveImageUrl (userId,todoId,newImage)
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

function getUploadUrl(imageId: string) {
  logger.info('Getting a SignedUrl')
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  })
}
