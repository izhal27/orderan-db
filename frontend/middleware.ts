export { auth as middleware } from "@/auth"

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|db-image.png|login-page-image.png|auth/signin).*)'
  ],
}
