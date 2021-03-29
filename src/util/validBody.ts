import { SlackEventMiddlewareArgs } from '@slack/bolt'

/**
 * Determines whether a Slack event body contains everything we need to log the event
 * @param body Slack event body
 * @returns Boolean indicating validity
 */
export function validBody<T extends string>(body: SlackEventMiddlewareArgs<T>['body']): boolean {
  let valid = true
  // Not all types have the things we check, so index w/ any to make TypeScript happy
  const event: typeof body.event & Record<string, any> = body.event
  if (!body.team_id) {
    valid = false
    console.error('Message body is missing "team_id"')
  }
  if (!event.user) {
    valid = false
    console.error('Message body is missing "event.user"')
  }
  if (!event.ts && !event.event_ts) {
    valid = false
    console.error('Message body is missing "event.ts" and "event.event_ts"')
  }
  if (!valid) {
    console.log(body)
  }
  return valid
}
