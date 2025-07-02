import { getDataFetch } from "@/apicalls/apicalls";
import { getDocDataFromCollectionByIdClient } from "@/db/CA/interface";
import { enrichFlowWithUserPorgress } from "@/components/course/layers/repository/courseETL";

export const checkCoursePaid = async ({ courseid, uid }) => {
  const coursePaid = await getDataFetch({
    type: "checkcoursepaid",
    data: { courseid, uid },
  });
  return coursePaid;
};

export const fetchAndEnrichFlow = async ({ courseid, progress }) => {
  const data = await getDocDataFromCollectionByIdClient("chapters", courseid);
  const flow = {
    nodes: data.data.chapterFlowNodes,
    edges: data.data.chapterFlowEdges,
  };

  const enrichedflow = enrichFlowWithUserPorgress({
    ...flow,
    progress,
  });

  return enrichedflow;
};

export const fetchChapterIds = async ({ courseid }) => {
  const data = await getDocDataFromCollectionByIdClient("chapters", courseid);
  return data.data.course.chapterFlowNodes
    .filter((node) => node.id != -1)
    .map((node) => node.id);
};
