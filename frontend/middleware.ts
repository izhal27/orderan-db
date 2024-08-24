import { auth } from "@/auth"
import { getSession } from "next-auth/react"

// export { auth as middleware } from "@/auth"

export default auth(async (req) => {
  const session = await auth();
  const role = session?.user.role;
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
  if (req.nextUrl.pathname === '/data/users' &&
    (role?.includes('operator') || role?.includes('designer'))
  ) {
    console.log('ACCESS DENIED');
    return Response.redirect(req.nextUrl.origin)
  }
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|db-image.png|login-page-image.png|auth/signin).*)'
  ],
}
