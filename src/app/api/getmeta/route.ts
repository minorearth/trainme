import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0; //revalidate api every 0 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

import { getDocSA, checkCoursePaidSA } from "@/db/SA/firebaseSA";

export async function POST(request: Request) {
  try {
    const reqData = await request.json();
    const { type, data } = reqData;
    let res;
    if (type == "getusermetadata") {
      res = await getDocSA("usermeta", data);
    }

    if (type == "checkcoursepaid") {
      res = await checkCoursePaidSA(data);
    }

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}
