//api calls
import { getDataFetch, setDataFetch } from "@/apicalls/apicalls";

//DB
import { getDocDataFromCollectionById } from "@/db/CA/firebaseCA";
import { encrypt2 } from "@/globals/utils/encryption";

//utils
import { extractChapterIdsOnly_admin } from "@/components/course/layers/services/utils";
import { EdgeDB, FlowDB, NodeDB } from "@/T/typesDB";

interface response {
  value: boolean;
  error: boolean;
}

export const checkCoursePaid = async ({
  courseid,
  uid,
}: {
  courseid: string;
  uid: string;
}): Promise<boolean> => {
  const coursePaid = await getDataFetch<boolean>({
    type: "checkcoursepaid",
    data: { courseid, id: uid },
  });
  return coursePaid.value;
};

export const fetchFlow = async ({ courseid }: { courseid: string }) => {
  const flowDB = await getDocDataFromCollectionById<FlowDB>({
    collectionName: "chapters",
    id: courseid,
  });
  const flow = {
    //confirm as
    nodes: flowDB?.chapterFlowNodes as NodeDB[],
    edges: flowDB?.chapterFlowEdges as EdgeDB[],
  };
  return flow;
};

export const fetchChapterIds_admin = async ({
  courseid,
}: {
  courseid: string;
}) => {
  const flowDB = await fetchFlow({ courseid });
  return extractChapterIdsOnly_admin(flowDB.nodes);
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
