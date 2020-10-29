import path from 'path'
import { write } from './util'

const job = process.argv[2]
if (path.basename(job) !== job) {
  throw new Error(`Bad job name: ${job}`)
}

const filename = process.argv[3] || `${job}.json`
if (path.basename(filename) !== filename) {
  throw new TypeError(`Bad file name: ${filename}`)
}

console.log(`Initializing job: ${job}`)

import(`./jobs/${job}`).then(async (exported: { job: () => Promise<unknown> }) => {
  console.log(`Running job: ${job}`)
  const data = await exported.job()
  if (data != null) {
    console.log(`Saving job "${job}" to ${filename}`)
    await write(filename, data)
  }
}).catch(console.error)
