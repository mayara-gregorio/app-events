import { cookies } from "next/headers"
import { jwtVerify } from "jose"

export async function getCurrentUser() {
  const token = (await cookies()).get("auth-token")?.value

  if (!token) {
    return null
  }

  const secret = process.env.JWT_SECRET

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))

    if (typeof payload.sub !== "string" || !payload.sub) {
      return null
    }

    return { id: payload.sub }
  } catch {
    return null
  }
}