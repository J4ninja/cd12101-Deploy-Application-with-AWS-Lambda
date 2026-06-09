// code derived from https://github.com/udacity/cd12101-lesson-demos-and-exercise-starters-solutions


import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const auth0Domain = process.env.AUTH0_DOMAIN
const jwksUrl = `https://${auth0Domain}/.well-known/jwks.json`

export async function handler(event) {
  try {

    logger.info('Authorizer received event:', { 
      hasToken: !!event.authorizationToken,
      tokenSnippet: event.authorizationToken ? event.authorizationToken.substring(0, 20) : 'none'
    })

    const jwtToken = await verifyToken(event.authorizationToken)

    logger.info('User successfully authorized', { sub: jwtToken.sub })

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [{ Action: 'execute-api:Invoke', Effect: 'Allow', Resource: '*' }]
      }
    }
  } catch (e) {

    logger.error('User not authorized - Verification Failed', { 
      errorMessage: e.message, 
      errorStack: e.stack 
    })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [{ Action: 'execute-api:Invoke', Effect: 'Deny', Resource: '*' }]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  if (!jwt?.header?.kid) {
    throw new Error('Invalid JWT: Missing kid header')
  }

  logger.info('Inspecting decoded JWT claims:', {
    header: jwt.header,
    payload: {
      iss: jwt.payload?.iss,
      sub: jwt.payload?.sub,
      aud: jwt.payload?.aud 
    }
  })

  const response = await Axios.get(jwksUrl)
  const key = response.data.keys.find((key) => key.kid === jwt.header.kid)

  if (!key?.x5c?.[0]) {
    throw new Error(`Signing certificate not found for kid: ${jwt.header.kid}`)
  }

  const certificate = [
    '-----BEGIN CERTIFICATE-----',
    key.x5c[0],
    '-----END CERTIFICATE-----'
  ].join('\n')

  return jsonwebtoken.verify(token, certificate, {
    algorithms: ['RS256'],
    audience: 'https://1pk6kx4jsk.execute-api.us-east-1.amazonaws.com/dev'
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