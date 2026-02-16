import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import S from "./globals/settings";

`/${S.P.CHAPTERS}`;

export function middleware(request: NextRequest) {
  const session = request.cookies.get(S.USER_SESSION);

  if (
    !session &&
    (request.nextUrl.pathname.startsWith(`/${S.P.CHAPTERS}`) ||
      request.nextUrl.pathname.startsWith(`/${S.P.GROUPS}`) ||
      request.nextUrl.pathname.startsWith(`/${S.P.JOINGROUP}`) ||
      request.nextUrl.pathname.startsWith(`/${S.P.PG}`))
  ) {
    return Response.redirect(new URL("/", request.url));
  }

  if (session && request.nextUrl.pathname.startsWith(`/${S.P.LOGIN}`)) {
    return Response.redirect(new URL(`/${S.P.CHAPTERS}`, request.url));
  }
}
