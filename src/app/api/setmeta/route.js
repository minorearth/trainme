import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 1; //revalidate api every 1 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

// import { createIndexAPI } from "./domain";
import {
  setUseMetaData,
  setUseMetaUnlockedAndCompleted,
  payChapter,
} from "@/db/SA/firebaseSA";

export async function POST(request) {
  try {
    const reqData = await request.json();

    const { type, data } = reqData;
    console.log(type, data);

    let res = "error";
    if (type == "setusermetadata") {
      res = await setUseMetaData(data);
    }
    if (type == "wakeup") {
      res = await setUseMetaData(data);
    }
    if (type == "unlockandcomplete") {
      res = await setUseMetaUnlockedAndCompleted(data);
    }

    if (type == "paychapter") {
      res = await payChapter(data);
    }

    return NextResponse.json({ res });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}
