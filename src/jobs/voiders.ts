import {
  AnyObject,
  app,
  list
} from '../util'
import { job as getMessages } from './messages'

const VOID_CHANNEL_ID = 'C011B2FJ90S'

export const job = async (): Promise<string[]> => {
  const messages = await getMessages()
  const active = messages.reduce((set: Set<string>, msg: AnyObject): Set<string> => set.add(msg.user), new Set())
  const voiders = await list(
    async (payload: AnyObject) => await app.client.conversations.members({ ...payload, channel: VOID_CHANNEL_ID }),
    'members'
  )
  return voiders.filter(user => !active.has(user))
}
