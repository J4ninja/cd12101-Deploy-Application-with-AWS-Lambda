import { parseUserId } from '../../auth/utils.mjs'

export function getUserId(authorizationHeader) {

  const split = authorizationHeader.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}
