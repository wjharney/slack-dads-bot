import { AnyObject, app, token, write } from '../util'
// import { job as getMessages } from './messages'

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
  let outrank = 1
  return entries.map(([outid, info], oidx): string => {
    if (oidx && info.total < entries[oidx - 1][1].total) outrank = oidx + 1
    const outer = outerMap.get(outid) ?? outid as any as string
    let inrank = 1
    const block = info.entries.map(([inid, count], iidx): string => {
      if (iidx && count < info.entries[iidx - 1][1]) inrank = iidx + 1
      const inner = innerMap.get(inid) ?? inid as any as string
      const percent = Math.round(100 * count / info.total)
      return `- ${inrank}. ${inner}: ${count} (${percent}%)`
    })
    return `${outrank}. ${outer} - ${info.total}\n${block.join('\n')}`
  }).join('\n\n')
}

export const job = async (): Promise<void> => {
  // const messages = await getMessages()
  const messages = require('../../reports/messages') // eslint-disable-line @typescript-eslint/no-var-requires
  const userReactions: Counter<string, string> = new Map()
  const reactionUsers: Counter<string, string> = new Map()
  for (const msg of messages) {
    for (const rx of msg.reactions || []) {
      const reaction = `:${rx.name as string}:`
      for (const user of rx.users) {
        increment(userReactions, user, reaction)
        increment(reactionUsers, reaction, user)
      }
    }
  }
  const urEntries = toEntries(userReactions)
  const ruEntries = toEntries(reactionUsers)

  const userMap = new Map(await Promise.all(urEntries.map(async ([id]): Promise<[string, string]> => {
    const info: AnyObject = await app.client.users.info({ token, user: id })
    const name: string = info.user.profile.display_name || info.user.profile.real_name
    return [id, `\`@${name}\``]
  })))

  const byUser = format(urEntries, userMap, new Map())
  const byReaction = format(ruEntries, new Map(), userMap)

  await Promise.all([
    write('reactions.txt', `${byUser}\n\n${byReaction}`)
  ])
}
