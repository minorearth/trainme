import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 1; //revalidate api every 1 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

import {
  paychapterDBSA,
  saveProgressDBSA,
  saveProgressDBSAFull,
} from "tpconst/RP/FB/repositoryFBSA.js";
import { SetDF } from "tpconst/const";
import { getNextErrorResponse } from "tpconst/errorHandlers";

interface reqData {
  type: string;
  data: string;
}
export async function POST(request: Request) {
  try {
    const reqData: reqData = await request.json();
    const { type, data } = reqData;
    if (type == SetDF.paychapter) {
      await paychapterDBSA({ dataEncrypted: data });
    }
    if (type == SetDF.setProgress) {
      await saveProgressDBSA({ dataEncrypted: data });
    }
    if (type == SetDF.setProgressDBFull) {
      await saveProgressDBSAFull({ dataEncrypted: data });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(getNextErrorResponse(error), { status: 500 });
  }
}
