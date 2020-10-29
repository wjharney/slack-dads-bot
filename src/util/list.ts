import { PromiseType } from 'utility-types'
import { token } from './app'

interface AnyObject {
  [key: string]: any
}

export async function list(
  func: (payload: AnyObject) => Promise<AnyObject>,
  key?: keyof PromiseType<ReturnType<typeof func>>
): Promise<any[]> {
  const result = []
  let cursor = ''
  do {
    const batch = await func({ cursor, token })
    if (!batch.ok) {
      const err: Error & { response: typeof batch } = new Error('Not OK') as any
      err.response = batch
      throw err
    }

    result.push(...batch[key as string])
    cursor = batch.response_metadata.next_cursor
  } while (cursor != null && cursor !== '')

  return result
}
