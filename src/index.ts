import { createEventAdapter } from '@slack/events-api'
import { AddressInfo } from 'net'
import dotenv from 'dotenv'
import { EventEmitter } from 'events'
import SlackEventAdapter from '@slack/events-api/dist/adapter'
dotenv.config()

if (typeof process.env.SLACK_SIGNING_SECRET !== 'string') {
  throw new Error('Missing required environment variable: SLACK_SIGNING_SECRET')
}
if (typeof process.env.PORT !== 'string') {
  throw new Error('Missing required environment variable: PORT')
}

const { SLACK_SIGNING_SECRET, PORT } = process.env
const VERIFY_ONLY = process.argv.includes('--verify')

async function init(): Promise<void> {
  const events = createEventAdapter(SLACK_SIGNING_SECRET) as SlackEventAdapter & EventEmitter
  const server = await events.createServer()

  if (VERIFY_ONLY) {
    console.log('Initializing for verification only.')
  } else {
    console.log('Connecting to database.')
    const db = await import('./db')
    await db.init()

    console.log('Listening to events.')
    const handlers = await import('./events')
    events.on('message', handlers.onMessage)
  }

  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(PORT, resolve)
  })
  const { address, port } = server.address() as AddressInfo
  console.log(`The server is now listening at http://${address}:${port}`)
}

init()
  .catch((error: Error) => {
    console.error(`The server failed to start: ${error.message}`)
  })
