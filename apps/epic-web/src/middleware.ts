import {NextRequest, NextResponse} from 'next/server'
import {getMiddlewareResponse} from './server/get-middleware-response'

const PUBLIC_FILE = /\.(.*)$/

export const config = {
  matcher: [
    '/',
    '/admin',
    '/tutorials/([^/]+/[^/]+(?:/exercise)?(?:/solution)?)',
    '/tips/new',
    '/tips/:path/edit',
    '/creator/tip/new',
    '/creator/tips',
    '/creator/tips/:path',
  ],
}

export async function middleware(req: NextRequest) {
  if (PUBLIC_FILE.test(req.nextUrl.pathname)) return NextResponse.next()
  return getMiddlewareResponse(req)
}
