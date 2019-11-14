import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify , decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtPayload } from '../../auth/JwtPayload'
import { Jwt } from '../../auth/Jwt'
import {parseUserId} from '../../auth/utils'
import * as AWS from 'aws-sdk'
/*
import Axios from 'axios'*/

//import { getUserId } from '../utils'


const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set


//const jwksUrl = '...'
const cert= `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJX3tP78GOUhzQMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1xMDhnNTlxNy5hdXRoMC5jb20wHhcNMTkxMTA1MTMwNzMxWhcNMzMw
NzE0MTMwNzMxWjAhMR8wHQYDVQQDExZkZXYtcTA4ZzU5cTcuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxVMXmE7QFDf/e6aTCW6zUtX3
mA2S0zHkGQ1Wka5sYL5iFSImcgy/OKhetguVFhSzCkZBU75xl/0pAxfuaJ1OuCVp
hu3G1bDfejdsDZcxYH+95P/BL2TCWcFjBKhQMW0+Bpto9UQoOLdERjBXCo4Qb7zS
VhOSngLIPujuqqK7jR5zOpHyoaqxxSQiGbx7GbayboojWI8sEmdIqlMLdoJjTufp
MqVDymb2Ul1FxATI8y6PS23TzYX/JJ36e6ExkcuWq33EFvuqkVOg2CrPL6iCbEn6
8jo3wl3v97iV8epxIvGhQHfcN/AQqjnjUv/03zCfYZnkG/QLnxLfTbR3NKhBOwID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTFTeBvf+yfuFkc2aN4
7bVsgbHVQjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAHKQPzVY
+gkNp770MvsWBv8tmPYw8uN0OpUniFWSuL2RaVR65HQzqHBOElUJ7BK5xF9CE0CH
MUqxaL+78Q5F6EGnFzclaRNTCahaeyqiXn5oUsIMK/DGsesV+imaxoV4JRldZOhS
3YbRIcecogbOxYD6yhVegGQP80rtUDonQ6CoIYA6i0iq4WU+0SQ3eRZOs/zOSvng
uuJb9fOq88Y32C45NbyYch2tgGMYvsCLVwaEtiXbKGwVNDbSt98NdWscu1SXdlv2
/LmpgJ3KCufpbgMcYmaIrOZt7iE4Jm+UojtTVvhBorxeIyj5CI4miYK3zZHJOwg7
af0DUmIcFmni2jw=
-----END CERTIFICATE-----
`

const docClient = new AWS.DynamoDB.DocumentClient()
const UsersTable = process.env.USERS_TABLE


export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)

  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)
    //add user to dynamodb table
    const userId =jwtToken.sub

    const newUser={
      id: userId,
      lastsignin: new Date().toISOString()
    }

    await docClient.put({
      TableName: UsersTable,
      Item: newUser
    }).promise()
    
    console.log('User was added to DB, ',userId )
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt //It does not validate a JWT token, but just parses it and returns its payload
  
  console.log(jwt)
  console.log('getUserId',parseUserId(token))
  

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader)
    throw new Error('No authentication header')
  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
