import { getDataFetch } from "@/db/APIcalls/calls";
import { getReadyCourses } from "@/globals/courses";
import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";
import { enrichFlowWithUserPorgress } from "@/components/course/layers/repository/courseETL";

import user from "@/userlayers/store/user";

export const checkCoursePaid = async ({ courseid }) => {
  const coursePaid = await getDataFetch({
    type: "checkcoursepaid",
    data: { courseid, uid: user.userid },
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
