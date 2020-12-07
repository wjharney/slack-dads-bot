import { App } from '@slack/bolt'
import dotenv from 'dotenv'
import { ensureEnv } from './ensureEnv'

dotenv.config()
ensureEnv('SLACK_BOT_TOKEN')
ensureEnv('SLACK_SIGNING_SECRET')

export const token = process.env.SLACK_BOT_TOKEN

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})
