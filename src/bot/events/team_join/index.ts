import { SlackEventMiddlewareArgs } from '@slack/bolt'
import { Action, ActionAttributes, validBody } from '../../../util'

/**
 * Handle a Slack message event
 * @param event Slack event object
 * @returns Boolean indicating whether the event was handles
 */
export const onTeamJoin = async ({ body, event }: SlackEventMiddlewareArgs<'team_join'>): Promise<void> => {
  if (!validBody(body)) {
    console.error('Team join event has invalid body.')
    return // Don't handle this event
  }
  const parsed: ActionAttributes = {
    action: 'team_join',
    team: body.team_id,
    user: (event.user as { id: string }).id,
    // Slack API includes `event_ts`, but it's missing from the @slack/bolt type definition :/
    timestamp: new Date(+(event as any).event_ts * 1000)
  }
  console.log(`[${parsed.timestamp.toISOString()}] ${parsed.action}: ${parsed.team}/${parsed.user}`)
  await Action.upsert(parsed)
}
