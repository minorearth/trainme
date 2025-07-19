import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0; //revalidate api every 0 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

import { getDocSA, checkCoursePaidSA } from "@/db/SA/firebaseSA";
import { CLT, UserMetaDB } from "@/T/typesDB";
import { GetDF } from "@/T/typesBasic";

export async function POST(request: Request) {
  try {
    const reqData = await request.json();
    const { type, data } = reqData;
    let res;
    if (type == GetDF.getusermetadata) {
      res = await getDocSA<UserMetaDB>({
        collectionName: CLT.usermeta,
        id: data.id,
      });
    }

    if (type == GetDF.checkcoursepaid) {
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
