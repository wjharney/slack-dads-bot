import { SlackEventMiddlewareArgs } from '@slack/bolt'
import { app } from '../../../util'

// TODO: Unhardcode
const alertChannel = 'C0KAS6WGK'

const colonize = (str: string): string => `:${str}:`
const codify = (str: string): string => `\`${str}\``
const unalias = (str: string): string => str.slice(6)
const isAlias = (str: string): boolean => str.slice(0, 6) === 'alias:'

/**
 * Handle a Slack emoji changed event
 * @param event Slack event object
 * @returns Boolean indicating whether the event was handled
 */
export const onEmojiChanged = async ({ event, body }: SlackEventMiddlewareArgs<'emoji_changed'>): Promise<void> => {
  let text: string
  let icon = 'possum'

  if (event.subtype === 'add') {
    const emoji = colonize(event.name as string)
    const escaped = codify(emoji)
    const url = event.value as string
    icon = event.name as string
    if (isAlias(url)) {
      const original = escape(colonize(unalias(url)))
      text = `New emoji alias: ${emoji} ${escaped} (alias for ${original})`
    } else {
      text = `New emoji: ${emoji} ${escaped}`
    }
  } else if (event.subtype === 'remove') {
    const removed = (event.names as string[]).map(name => codify(colonize(name))).join(' ')
    text = `Emoji removed: ${removed}`
  } else if (event.subtype === 'rename') {
    const emoji = colonize(event.new_name)
    const escaped = codify(emoji)
    const prev = codify(colonize(event.old_name))
    text = `Emoji name changed: ${emoji} ${escaped} (was ${prev})`
    icon = event.new_name as string
  } else {
    console.error(`Unknown emoji subtype: ${event.subtype as string}`)
    console.log(body)
    return
  }

  await app.client.chat.postMessage({
    channel: alertChannel,
    text,
    icon_emoji: icon
  })
}
