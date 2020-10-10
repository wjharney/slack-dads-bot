#!/usr/bin/env node
// Basically the Slack verify tool, but with dotenv
// See: https://github.com/slackapi/node-slack-sdk/blob/main/packages/events-api/src/verify.ts

import { createEventAdapter } from '@slack/events-api'
import { AddressInfo } from 'net'

if (!process.env.SLACK_SIGNING_SECRET || !process.env.PORT) {
  require('dotenv').config()
  if (!process.env.SLACK_SIGNING_SECRET) {
    throw new Error('Cannot verify without SLACK_SIGNING_SECRET.')
  }
}

const PORT = process.env.PORT ? +process.env.PORT : 3000

createEventAdapter(process.env.SLACK_SIGNING_SECRET)
  .createServer()
  .then(
    server =>
      new Promise((resolve, reject) => {
        server.on('error', reject)
        server.listen(PORT, () => {
          const { address, port } = server.address() as AddressInfo
          console.log(`The verification server is now listening at the URL: http://${address}:${port}`)
          resolve()
        })
      })
  )
  .catch(error => {
    console.error(`The verification server failed to start: ${error.message}`)
  })
