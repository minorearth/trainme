//api calls
import { getDataFetch, setDataFetch } from "@/apicalls/apicalls";

//DB
import { getDocDataFromCollectionByIdClient } from "@/db/CA/interface";
import { encrypt2 } from "@/globals/utils/encryption";

export const checkCoursePaid = async ({ courseid, uid }) => {
  const coursePaid = await getDataFetch({
    type: "checkcoursepaid",
    data: { courseid, id: uid },
  });
  return coursePaid;
};

export const fetchFlow = async ({ courseid }) => {
  const data = await getDocDataFromCollectionByIdClient("chapters", courseid);
  const flow = {
    nodes: data.data.chapterFlowNodes,
    edges: data.data.chapterFlowEdges,
  };
  return flow;
};

export const fetchChapterIds = async ({ courseid }) => {
  const data = await getDocDataFromCollectionByIdClient("chapters", courseid);

  return data.data.chapterFlowNodes
    .filter((node) => node.id != -1)
    .map((node) => node.id);
};

export const buyChapterCall = async ({
  rating,
  paidchapers,
  courseid,
  unlockpts,
  chapterid,
  uid,
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
