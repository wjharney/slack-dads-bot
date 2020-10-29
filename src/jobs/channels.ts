import {
  AnyObject,
  app,
  list
} from '../util'

export const job = async (): Promise<AnyObject[]> => await list(
  async (payload: AnyObject) => await app.client.conversations.list(payload),
  'channels'
)
