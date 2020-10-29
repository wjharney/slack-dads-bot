import { App } from '@slack/bolt'
import dotenv from 'dotenv'
dotenv.config()

if (!process.env.SLACK_BOT_TOKEN) {
  throw new Error('Missing Slack bot token.')
}

if (!process.env.SLACK_SIGNING_SECRET) {
  throw new Error('Missing Slack signing secret.')
}

export const token = process.env.SLACK_BOT_TOKEN

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
})
