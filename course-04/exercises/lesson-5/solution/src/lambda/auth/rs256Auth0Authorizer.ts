
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
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

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

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
    console.log('User authorized', e.message)

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

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
