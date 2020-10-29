import {
  AnyObject,
  app,
  list
} from '../util'
import { job as getChannels } from './channels'

async function getMessages(id: string): Promise<AnyObject[]> {
  const allMessages = await list(
    async (payload: AnyObject) => await app.client.conversations.history({ ...payload, channel: id }),
    'messages'
  )
  // Messages w/ a subtype are actions (joined, pinned, etc.), not actual messages
  const realMessages = allMessages.filter(msg => !msg.subtype)
  // Slack API uses channel as a parameter, so it's not in the response, but we still want to save it
  realMessages.forEach(msg => { msg.channel = msg.channel || id })
  return realMessages
}

export async function getChannelMessages(channel: AnyObject): Promise<AnyObject[]> {
  try {
    try {
      return await getMessages(channel.id)
    } catch (err) {
      if ((err?.data || err?.response)?.error === 'not_in_channel') {
        if (channel.is_archived) return [] // Can't join to get messages
        await app.client.conversations.join({ channel: channel.id })
        return await getMessages(channel.id)
      }
      throw err
    }
  } catch (err) {
    err.channel = channel
    throw err
  }
}

export const job = async (): Promise<AnyObject[]> => await getChannels()
  .then(async channels => await Promise.all(channels.map(getChannelMessages)))
  .then(messages => messages.flat())
