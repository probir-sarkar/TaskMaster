export type JWTPayload = {
  id: number
  name: string | null
  exp: number
}

export type AppEnv = {
  Bindings: {
    DB: D1Database
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    JWT_SECRET: string
    CLIENT_URL: string
  }
  Variables: {
    jwtPayload: JWTPayload
  }
}
