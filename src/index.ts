import { createEventAdapter } from '@slack/events-api'
import SlackEventAdapter from '@slack/events-api/dist/adapter'
import { Server } from 'http'
import { AddressInfo } from 'net'

require('dotenv').config() // eslint-disable-line @typescript-eslint/no-var-requires

if (typeof process.env.SLACK_SIGNING_SECRET !== 'string') {
  throw new Error('Missing required environment variable: SLACK_SIGNING_SECRET')
}
if (typeof process.env.PORT !== 'string') {
  throw new Error('Missing required environment variable: PORT')
}

const { SLACK_SIGNING_SECRET, PORT } = process.env
const VERIFY_ONLY = process.argv.includes('--verify')

async function init(events: SlackEventAdapter, server: Server): Promise<void> {
  console.log(events, server)
}

; (async () => {
  const events = createEventAdapter(SLACK_SIGNING_SECRET)
  const server = await events.createServer()
  if (VERIFY_ONLY) {
    console.log('Initializing for verification only.')
  } else {
    console.log('Initializing full functionality.')
    await init(events, server)
  }
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(PORT, resolve)
  })
  const { address, port } = server.address() as AddressInfo
  console.log(`The server is now listening at http://${address}:${port}`)
})()
  .catch((error: Error) => {
    console.error(`The server failed to start: ${error.message}`)
  })
