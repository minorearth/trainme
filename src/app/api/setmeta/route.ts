import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 1; //revalidate api every 1 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

import { updateDocSA } from "@/db/SA/firebaseSA";
import { CLT, UserMetaDB } from "@/T/typesDB";
import { GetDF, SetDF } from "@/T/typesBasic";
import { FirestoreError } from "firebase/firestore";
import E, { NextErrorResponseHandler } from "@/globals/errorMessages";

interface reqData {
  type: string;
  data: string;
}
export async function POST(request: Request) {
  try {
    const reqData: reqData = await request.json();
    const { type, data } = reqData;
    if (type == SetDF.paychapter || type == SetDF.setusermetadata) {
      await updateDocSA<UserMetaDB>({
        collectionName: CLT.usermeta,
        dataencrypted: data,
      });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextErrorResponseHandler(error);
  }
}
