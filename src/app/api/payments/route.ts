// import { NextResponse } from "next/server";

import { NextResponse } from "next/server";
import { getNextErrorResponse } from "tpconst/errorHandlers";

export const dynamic = "force-dynamic";
export const revalidate = 1; //revalidate api every 1 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

interface reqData {
  type: string;
  data: string;
}
export async function POST(request: Request) {
  try {
    const reqData: reqData = await request.json();
    console.log("2ok2");
    console.log("payment", reqData);
    return NextResponse.json(reqData, { status: 200 });
  } catch (error) {
    return NextResponse.json(getNextErrorResponse(error), { status: 500 });
  }
}
