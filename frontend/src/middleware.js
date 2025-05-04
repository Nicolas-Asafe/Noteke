import { NextResponse } from 'next/server'

const publicRoutes = ['/Login', '/Register','/']

export function middleware(request) {
  const path = request.nextUrl.pathname
  const isPublic = publicRoutes.includes(path)

  // Pega o token do cookie
  const authToken = request.cookies.get('token')?.value

  // Usuário não está logado e tenta acessar rota privada → redireciona
  if (!authToken && !isPublic) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Usuário está logado e tenta acessar rota pública → redireciona pro dashboard
  if (authToken && isPublic) {
    return NextResponse.redirect(new URL('/home', request.url)) // ou /dashboard
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
