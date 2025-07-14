//api calls
import { getDataFetch, setDataFetch } from "@/apicalls/apicalls";

//DB
import { getDocDataFromCollectionByIdClient } from "@/db/CA/interface";
import { encrypt2 } from "@/globals/utils/encryption";

//utils
import { extractChapterIdsOnly_admin } from "@/components/course/layers/services/utils";

export const checkCoursePaid = async ({
  courseid,
  uid,
}: {
  courseid: string;
  uid: string;
}) => {
  const coursePaid = await getDataFetch({
    type: "checkcoursepaid",
    data: { courseid, id: uid },
  });
  return coursePaid;
};

export const fetchFlow = async ({ courseid }: { courseid: string }) => {
  const data = await getDocDataFromCollectionByIdClient("chapters", courseid);
  const flow = {
    nodes: data.data?.chapterFlowNodes,
    edges: data.data?.chapterFlowEdges,
  };
  return flow;
};

export const fetchChapterIds_admin = async ({
  courseid,
}: {
  courseid: string;
}) => {
  const data = await getDocDataFromCollectionByIdClient("chapters", courseid);
  return extractChapterIdsOnly_admin(data.data?.chapterFlowNodes);
};

export const buyChapterCall = async ({
  rating,
  paidchapers,
  courseid,
  unlockpts,
  chapterid,
  uid,
}: {
  rating: number;
  paidchapers: string[];
  courseid: string;
  unlockpts: number;
  chapterid: string;
  uid: string;
}) => {
  await setDataFetch({
    type: "paychapter",
    data: encrypt2({
      data: {
        [`courses.${courseid}.rating`]: rating - unlockpts,
        [`courses.${courseid}.lastunlocked`]: [chapterid],
        [`courses.${courseid}.paid`]: [...paidchapers, chapterid],
      },
      id: uid,
    }),
  });
};
