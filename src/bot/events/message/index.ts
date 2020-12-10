import { SlackEventMiddlewareArgs, MessageEvent } from '@slack/bolt'
import { Action, ActionAttributes } from '../../../util/db'

const shouldHandle = (event: MessageEvent): boolean => {
  return typeof event.channel === 'string' && !event.subtype
}

const validBody = (body: SlackEventMiddlewareArgs<'message'>['body']): boolean => {
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

/**
 * Handle a Slack message event
 * @param event Slack event object
 * @returns Boolean indicating whether the event was handles
 */
export const onMessage = async ({ body, event }: SlackEventMiddlewareArgs<'message'>): Promise<void> => {
  if (!shouldHandle(event) || !validBody(body)) {
    return // Don't handle this event
  }
  const parsed: ActionAttributes = {
    action: 'message',
    team: body.team_id,
    user: event.user,
    timestamp: new Date(+event.ts * 1000)
  }
  console.log(`[${parsed.timestamp.toISOString()}] ${parsed.action}: ${parsed.team}/${parsed.user}`)
  await Action.upsert(parsed)
}
