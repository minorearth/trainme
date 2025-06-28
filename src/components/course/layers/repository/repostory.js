import { getDataFetch } from "@/apicalls/apicalls";
import { getReadyCourses } from "@/globals/courses";
import { getDocDataFromCollectionByIdClient } from "@/db/CA/interface";
import { enrichFlowWithUserPorgress } from "@/components/course/layers/repository/courseETL";

export const checkCoursePaid = async ({ courseid, uid }) => {
  const coursePaid = await getDataFetch({
    type: "checkcoursepaid",
    data: { courseid, uid },
  });
  return coursePaid;
};

export const checkCourseReady = ({ courseid }) => {
  return getReadyCourses().includes(courseid);
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
