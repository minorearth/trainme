// import { NextResponse } from "next/server";

import { NextResponse } from "next/server";
import { getNextErrorResponse } from "tpconst/errorHandlers";
import { buyCourseDBSA } from "tpconst/RP/FB/repositoryFBSA.js";

export const dynamic = "force-dynamic";
export const revalidate = 1; //revalidate api every 1 second
//https://stackoverflow.com/questions/76356803/data-not-updating-when-deployed-nextjs13-app-on-vercel-despite-using-cache-no

// {
//   type: 'notification',
//   event: 'payment.succeeded',
//   object: {
//     id: '3023e58f-000f-5000-8000-16594f87f058',
//     status: 'succeeded',
//     amount: { value: '2.00', currency: 'RUB' },
//     income_amount: { value: '1.93', currency: 'RUB' },
//     description: 'qqj0k5PyEYWKazP6Li0lVJMJ8lD3@555',
//     recipient: { account_id: '1138711', gateway_id: '2508676' },
//     payment_method: {
//       type: 'bank_card',
//       id: '3023e58f-000f-5000-8000-16594f87f058',
//       saved: false,
//       status: 'inactive',
//       title: 'Bank card *4477',
//       card: [Object]
//     },
//     captured_at: '2025-08-05T09:42:08.072Z',
//     created_at: '2025-08-05T09:41:35.090Z',
//     test: true,
//     refunded_amount: { value: '0.00', currency: 'RUB' },
//     paid: true,
//     refundable: true,
//     metadata: {},
//     authorization_details: {
//       rrn: '763840468948824',
//       auth_code: '532292',
//       three_d_secure: [Object]
//     }
//   }
// }

interface reqData {
  type: string;
  event: string;
  object: {
    id: string;
    status: string;
    amount: Object;
    income_amount: Object;
    description: string;
    recipient: Object;
    payment_method: {
      type: string;
      id: string;
      saved: false;
      status: string;
      title: string;
      card: Object;
    };
    captured_at: string;
    created_at: string;
    test: true;
    refunded_amount: Object;
    paid: boolean;
    refundable: boolean;
    metadata: Object;
    authorization_details: {
      rrn: string;
      auth_code: string;
      three_d_secure: Object;
    };
  };
}

function getFirstWord(str: string) {
  const match = str.match(/^([^@]+)@/);
  return match ? match[1] : "null";
}
// Функция для извлечения второго слова после '@'
function getSecondWord(str: string) {
  const match = str.match(/@([^@]+)$/);
  return match ? match[1] : "null";
}

export async function POST(request: Request) {
  try {
    const reqData: reqData = await request.json();
    const desc = reqData.object.description;
    await buyCourseDBSA({
      uid: getFirstWord(desc),
      courseid: getSecondWord(desc),
    });
    // `${uid}@${courseid}`

    return NextResponse.json(reqData, { status: 200 });
  } catch (error) {
    return NextResponse.json(getNextErrorResponse(error), { status: 500 });
  }
}
