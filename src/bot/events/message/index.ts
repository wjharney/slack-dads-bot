import { Action, ActionAttributes } from '../../../util/db'

interface MessageEvent {
  type: 'message'
  subtype: string
  channel_type: 'channel'
  user: string
  ts: string
  team: string
}

const shouldHandle = (event: MessageEvent): boolean => {
  return event.channel_type === 'channel' && event.subtype !== 'bot_message'
}

/**
 * Handle a Slack message event
 * @param event Slack event object
 * @returns Boolean indicating whether the event was handles
 */
export const onMessage = async (event: MessageEvent): Promise<boolean> => {
  if (!shouldHandle(event)) {
    return false // Don't handle this event
  }
  const parsed: ActionAttributes = {
    action: 'message',
    team: event.team,
    user: event.user,
    timestamp: new Date(+event.ts * 1000)
  }
  console.log(`[${parsed.timestamp.toISOString()}] ${parsed.action}: ${parsed.team}/${parsed.user}`)
  await Action.upsert(parsed)
  return true
}
