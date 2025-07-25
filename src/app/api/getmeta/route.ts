import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0; //revalidate api every 0 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

import { getDocSA, checkCoursePaidSA } from "@/db/SA/firebaseSA";
import { CLT, UserMetaDB } from "@/T/typesDB";
import { GetDF } from "@/T/typesBasic";
import { NextErrorResponseHandler } from "@/globals/errorMessages";
import { ServerResponseData } from "@/T/typesFetch";

export async function POST(request: Request) {
  try {
    const reqData = await request.json();
    const { type, data } = reqData;

    if (type == GetDF.getusermetadata) {
      const value = await getDocSA<UserMetaDB>({
        collectionName: CLT.usermeta,
        id: data.id,
      });
      const response: ServerResponseData<UserMetaDB> = {
        value,
        success: true,
      };
      return NextResponse.json(response, { status: 200 });
    }

    if (type == GetDF.checkcoursepaid) {
      const value = await checkCoursePaidSA(data);
      const response: ServerResponseData<boolean> = {
        value,
        success: true,
      };
      return NextResponse.json(response, { status: 200 });
    }
  } catch (error) {
    return NextErrorResponseHandler(error);
  }
}
