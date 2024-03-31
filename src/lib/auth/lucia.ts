// ****************** //
import 'server-only'
// ****************** //

import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import db from '@/lib/db'
import { Lucia } from 'lucia'

const adapter = new PrismaAdapter(db.session, db.user) // your adapter

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // attributes has the type of DatabaseUserAttributes
      googleId: attributes.googleId,
      email: attributes.email,
    }
  },
})

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  googleId: string
  email: string
}
