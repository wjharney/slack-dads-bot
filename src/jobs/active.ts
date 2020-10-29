import { AnyObject, app, token, write } from '../util'
import { job as getChannels } from './channels'
import { getChannelMessages } from './messages'

type Counter<Outer, Inner> = Map<Outer, Map<Inner, number>>
type Entries<Outer, Inner> = Array<[Outer, { total: number, entries: Array<[Inner, number]> }]>

function increment<Outer, Inner>(outer: Counter<Outer, Inner>, first: Outer, second: Inner): void {
  let inner = outer.get(first)
  if (!inner) {
    inner = new Map()
    outer.set(first, inner)
  }
  const count = 1 + (inner.get(second) ?? 0)
  inner.set(second, count)
}

function toEntries<Outer, Inner>(outer: Counter<Outer, Inner>): Entries<Outer, Inner> {
  const entries = [...outer].map(([key, inner]): [Outer, { total: number, entries: Array<[Inner, number]> }] => {
    const entries = [...inner]
    entries.sort((a, b) => b[1] - a[1])
    const total = entries.reduce((sum, [, count]) => sum + count, 0)
    return [key, { total, entries }]
  })
  entries.sort((a, b) => b[1].total - a[1].total)
  return entries
}

function format<Outer, Inner>(
  entries: Entries<Outer, Inner>,
  outerMap: Map<Outer, string>,
  innerMap: Map<Inner, string>
): string {
  return entries.map(([outid, info], oidx): string => {
    const outer = outerMap.get(outid) ?? '???'
    const block = info.entries.map(([inid, count], iidx): string => {
      const inner = innerMap.get(inid) ?? '???'
      const percent = Math.round(100 * count / info.total)
      return `- ${iidx + 1}. ${inner}: ${count} (${percent}%)`
    })
    return `${oidx + 1}. ${outer} - ${info.total}\n${block.join('\n')}`
  }).join('\n\n')
}

export const job = async (): Promise<void> => {
  const channels = await getChannels()
  const channelMap = new Map<string, string>(channels.map(ch => [ch.id, `#${ch.name as string}`]))
  const batches = await Promise.all(channels.map(getChannelMessages))
  const messages = batches.flat()

  const channelUsers: Counter<string, string> = new Map()
  const userChannels: Counter<string, string> = new Map()

  for (const msg of messages) {
    increment(channelUsers, msg.channel, msg.user)
    increment(userChannels, msg.user, msg.channel)
  }

  const cuEntries = toEntries(channelUsers)
  const ucEntries = toEntries(userChannels)

  const userMap = new Map(await Promise.all(ucEntries.map(async ([id]): Promise<[string, string]> => {
    const info: AnyObject = await app.client.users.info({ token, user: id })
    const name: string = info.user.profile.display_name || info.user.profile.real_name
    return [id, `@${name}`]
  })))

  const byChannel = format(cuEntries, channelMap, userMap)
  const byUser = format(ucEntries, userMap, channelMap)

  await Promise.all([
    write('active-channels.txt', byChannel),
    write('active-users.txt', byUser)
  ])
}
