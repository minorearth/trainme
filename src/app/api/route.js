import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0; //revalidate api every 0 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

// import { createIndexAPI } from "./domain";
import { setUseMetaData } from "@/db/SA/firebaseSA";

export async function GET() {
  // await createIndexAPI();
  const res = { job: "done" };
  return NextResponse.json(res);
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Received data:", data);
    await setUseMetaData(data);

    return NextResponse.json({ message: "Data received successfully", data });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
}
