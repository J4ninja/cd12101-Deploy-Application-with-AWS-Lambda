import { parseUserId } from '../../auth/utils.mjs'

export function getUserId(authorizationHeader) {

  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
