import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 1; //revalidate api every 1 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

import { updateDocSA } from "@/db/FB/SA/firebaseSA";
import { UserMetaDB } from "tpconst/T";
import { SetDF, CLT } from "tpconst/const";
import { getNextErrorResponse } from "tpconst/errorHandlers";

interface reqData {
  type: string;
  body: string;
}
export async function POST(request: Request) {
  try {
    const reqData: reqData = await request.json();
    const { type, body } = reqData;
    if (type == SetDF.paychapter || type == SetDF.setusermetadata) {
      await updateDocSA<UserMetaDB>({
        collectionName: CLT.usermeta,
        dataencrypted: body,
      });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(getNextErrorResponse(error), { status: 500 });
  }
}
