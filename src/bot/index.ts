import { app, ensureEnv } from '../util'

const PORT = +ensureEnv('PORT')

const VERIFY_ONLY = process.argv.includes('--verify')

async function init(): Promise<void> {
  if (VERIFY_ONLY) {
    console.log('Initializing for verification only.')
  } else {
    console.log('Connecting to database.')
    const db = await import('../util/db')
    await db.init()

    console.log('Listening to events.')
    const handlers = await import('./events')
    app.message(handlers.onMessage)
    app.event('emoji_changed', handlers.onEmojiChanged)
    app.event('team_join', handlers.onTeamJoin)
  }

  await app.start(PORT)
}

init()
  .then(() => console.log('Up and running!'))
  .catch((error: Error) => {
    console.error(`The server failed to start: ${error.message}`)
  })
