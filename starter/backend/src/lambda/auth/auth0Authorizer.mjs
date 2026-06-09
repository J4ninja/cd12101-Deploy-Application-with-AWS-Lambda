import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const auth0Domain = process.env.AUTH0_DOMAIN
const jwksUrl = `https://${auth0Domain}/.well-known/jwks.json`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

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

async function verifyToken(authHeader) {
  const token = getToken(authHeader)

  const jwt = jsonwebtoken.decode(token, { complete: true })

  if (!jwt?.header?.kid) {
    throw new Error('Invalid JWT')
  }

  const response = await Axios.get(jwksUrl)

  const key = response.data.keys.find(
    (key) => key.kid === jwt.header.kid
  )

  if (!key?.x5c?.[0]) {
    throw new Error('Signing certificate not found')
  }

  const certificate = [
    '-----BEGIN CERTIFICATE-----',
    key.x5c[0],
    '-----END CERTIFICATE-----'
  ].join('\n')

  return jsonwebtoken.verify(token, certificate, {
    algorithms: ['RS256']
  })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}