import { cookies } from "next/headers";

export function middleware(request) {
  const session = request.cookies.get("session");

  if (
    !session &&
    (request.nextUrl.pathname.startsWith("/chapters") ||
      request.nextUrl.pathname.startsWith("/groups") ||
      request.nextUrl.pathname.startsWith("/joingroup"))
  ) {
    return Response.redirect(new URL("/", request.url));
  }

  if (session && request.nextUrl.pathname.startsWith("/login")) {
    return Response.redirect(new URL("/chapters", request.url));
  }
}
