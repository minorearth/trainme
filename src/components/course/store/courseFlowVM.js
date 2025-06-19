import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";

import { toJS } from "mobx";

//stores
import user from "@/store/user";
import course from "@/components/course/store/course";
import { enrichFlowWithUserPorgress } from "@/components/course/store/courseETL";

export const getInitialFlow = async ({ courseid, refetchFlow }) => {
  const flow = refetchFlow ? await fetchFlow({ courseid }) : course.initialFlow;
  course.setInitialFlow(flow);
  return flow;
};

export const getFlow = async ({ courseid, refetchFlow }) => {
  const progress = await user.actions.getUserCourseProgress(courseid);

  const flow = await getInitialFlow({ courseid, refetchFlow });
  const nodes = enrichFlowWithUserPorgress({
    ...flow,
    progress,
  });
  return { flow: { ...flow, nodes }, progress };
};

const fetchFlow = async ({ courseid }) => {
  const data = await getDocDataFromCollectionByIdClient("chapters", courseid);
  const flow = {
    nodes: data.data.chapterFlowNodes,
    edges: data.data.chapterFlowEdges,
  };
  return flow;
};
