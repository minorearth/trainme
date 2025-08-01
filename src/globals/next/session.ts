"use server";
import { cookies } from "next/headers";
import S from "@/globals/settings";

export async function login(user: string) {
  //TODO: to settings
  const expires = new Date(Date.now() + 60 * 60 * 20 * 1000);
  // const expires = new Date(Date.now() + 10000);
  cookies().set(S.USER_SESSION, user, { expires, httpOnly: true });
}

export async function logout() {
  cookies().set(S.USER_SESSION, "", { expires: new Date(0) });
}

// export async function updateSession(request) {
//   const session = request.cookies.get("__session")?.value;
//   if (!session) return;
//   const parsed = await decrypt(session);
//   parsed.expires = new Date(Date.now() + 1000);
//   const res = NextResponse.next();
//   res.cookies.set({
//     name: "__session",
//     value: await encrypt(parsed),
//     httpOnly: true,
//     expires: parsed.expires,
//   });
//   return res;
// }
