import { AnyObject } from './types'
import * as reports from './reports'

export function cachify<K, V>(func: (key: K) => Promise<V>): (key: K) => Promise<V>
export function cachify<K, V>(func: (key: K) => Promise<V>, init: Map<K, V | Promise<V>>): (key: K) => Promise<V>
export function cachify<V>(func: (key: string) => Promise<V>, init: Record<string, V | Promise<V>>): (key: string) => Promise<V>
export function cachify<V, K>(func: (key: K) => Promise<V>, init?: Map<K, V | Promise<V>> | Record<string, V | Promise<V>>): (key: K) => Promise<V> {
  // Map stores promised value instead of value so that if a key is requested again before the first one finishes, it
  // will still only call the function once.
  const entries: Array<[string | K, V | Promise<V>]> = init ? init instanceof Map ? [...init] : Object.entries(init) : []
  const map = new Map(entries.map(([key, value]) => [key, Promise.resolve(value)]))
  return async function (this: any, key: K): Promise<V> {
    if (map.has(key)) {
      return await map.get(key) as V
    }
    const promise = func.call(this, key)
    map.set(key, promise)
    return await promise
  }
}

export function cachifySlack(func: (payload: AnyObject) => Promise<AnyObject>, file?: string): (payload: AnyObject) => Promise<AnyObject> {
  if (!file || !reports.existsSync(file)) {
    return cachify(func)
  }
  const obj = reports.readSync(file)
  if (typeof obj !== 'object') {
    throw new TypeError('Invalid file contents.')
  }
  return cachify(func, obj)
}
