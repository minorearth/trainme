import { toJS } from "mobx";

import { fetchAndEnrichFlow } from "@/components/course/layers/repository/repostory";

//stores
import course from "@/components/course/layers/store/course";

export const getFlow = async ({ courseid, refetchFlow, progress }) => {
  if (refetchFlow) {
    const flow = await fetchAndEnrichFlow({ courseid, progress });
    course.setInitialFlow(flow);
    course.setFlow(flow);
  } else {
    course.setFlow({ ...course.initialFlow });
  }
};
