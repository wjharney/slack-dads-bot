import { SlackEventMiddlewareArgs } from '@slack/bolt'

export function validBody<T extends string>(body: SlackEventMiddlewareArgs<T>['body']): boolean {
  let valid = true
  if (!body.team_id) {
    valid = false
    console.error('Message body is missing "team_id"')
  }
  if (!body.event.user) {
    valid = false
    console.error('Message body is missing "event.user"')
  }
  if (!body.event.ts) {
    valid = false
    console.error('Message body is missing "event.ts"')
  }
  if (!valid) {
    console.log(body)
  }
  return valid
}