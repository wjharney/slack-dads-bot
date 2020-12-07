export function ensureEnv(key: string, allowEmptyString = false): string {
  const val = process.env[key]

  if (!val && !(allowEmptyString && val === '')) {
    throw new Error(`Missing required environment variable: $${key}`)
  }

  return val
}
