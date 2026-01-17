import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0; //revalidate api every 0 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

import { CourseProgressDB, UserMetaDB } from "@/tpconst/src/T";
import { GetDF } from "@/tpconst/src/const";

import { ServerResponseData } from "@/tpconst/src/T";
import { getNextErrorResponse } from "@/tpconst/src/errorHandlers";

import {
  checkCoursePaidDBSA,
  getPaymentIdDBSA,
  getUserCourseMetaDBSA,
  getUserMetaDBSA,
} from "@/tpconst/src/RP/FB/repositoryFBSA";

export async function POST(request: Request) {
  try {
    const reqData = await request.json();
    const { type, data } = reqData;

    if (type == GetDF.getusermetadata) {
      const value = await getUserMetaDBSA(data.id);
      const response: ServerResponseData<UserMetaDB> = {
        value,
        success: true,
      };
      return NextResponse.json(response, { status: 200 });
    }

    if (type == GetDF.getuserCoursemetadata) {
      const value = await getUserCourseMetaDBSA(data.id, data.courseid);
      const response: ServerResponseData<CourseProgressDB> = {
        value,
        success: true,
      };
      return NextResponse.json(response, { status: 200 });
    }

    if (type == GetDF.checkcoursepaid) {
      const value = await checkCoursePaidDBSA(data.courseid, data.id);
      const response: ServerResponseData<boolean> = {
        value,
        success: true,
      };
      return NextResponse.json(response, { status: 200 });
    }

    if (type == GetDF.getpaymentid) {
      const value = await getPaymentIdDBSA(data);
      const response: ServerResponseData<any> = {
        value,
        success: true,
      };
      return NextResponse.json(response, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(getNextErrorResponse(error), { status: 500 });
  }
}
