import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Apply CORS headers
  response.headers.set("Access-Control-Allow-Origin", "https://mgm-admin.vercel.app")
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

  return response
}

// Enable middleware only for API routes (e.g., /api/*)
export const config = {
  matcher: ["/api/:path*"],
}
