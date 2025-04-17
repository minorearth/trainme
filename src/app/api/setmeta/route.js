import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0; //revalidate api every 0 second
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
    if (type == "setusermetadata") {
      await setUseMetaData(data);
    }
    if (type == "unlockandcomplete") {
      await setUseMetaUnlockedAndCompleted(data);
    }

    if (type == "paychapter") {
      await payChapter(data);
    }

    return NextResponse.json({ message: "Data received successfully" });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}
