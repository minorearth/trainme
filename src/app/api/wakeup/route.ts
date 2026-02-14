import { NextResponse } from "next/server";
import { getNextErrorResponse } from "@/tpconst/src/errorHandlers";
export const dynamic = "force-dynamic";
export const revalidate = 0; //revalidate api every 0 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

export async function POST() {
  try {
    const res = "wakeup";
    return NextResponse.json({ res });
    console.log("wake up passed");
  } catch (error) {
    console.log("wake up fail");
    return NextResponse.json(getNextErrorResponse(error), { status: 500 });
  }
}
