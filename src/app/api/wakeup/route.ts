import { NextResponse } from "next/server";
import { getNextErrorResponse } from "tpconst/errorHandlers";
export const dynamic = "force-dynamic";
export const revalidate = 0; //revalidate api every 0 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

export async function POST() {
  try {
    const res = "wakeup";
    return NextResponse.json({ res });
  } catch (error) {
    return NextResponse.json(getNextErrorResponse(error), { status: 500 });
  }
}
