import { createAuthClient } from 'better-auth/react'
import { anonymousClient } from 'better-auth/client/plugins'

export const client = createAuthClient({
  plugins: [anonymousClient()],
})
