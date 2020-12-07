import { SlackEventMiddlewareArgs, MessageEvent } from '@slack/bolt'
import { Action, ActionAttributes } from '../../../util/db'

const shouldHandle = (event: MessageEvent): boolean => {
  return typeof event.channel === 'string' && !event.subtype
}

/**
 * Handle a Slack message event
 * @param event Slack event object
 * @returns Boolean indicating whether the event was handles
 */
export const onMessage = async ({ body, event }: SlackEventMiddlewareArgs<'message'>): Promise<void> => {
  if (!shouldHandle(event)) {
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
