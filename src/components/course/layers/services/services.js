import { toJS } from "mobx";

//repository(local)
import {
  fetchFlow,
  buyChapterCall,
} from "@/components/course/layers/repository/repository";

//stores
import course from "@/components/course/layers/store/course";
import user from "@/userlayers/store/user";
import navigator from "@/components/Navigator/layers/store/navigator";
import progressCircle from "@/components/common/splash/store";

//service helpers
import { enrichFlowWithUserProgress } from "@/components/course/layers/services/servicesHelpers";

export const getFlow = async ({ courseid, refetchFlow, progress }) => {
  if (refetchFlow) {
    const flow = await fetchFlow({ courseid });
    const enrichedflow = enrichFlowWithUserProgress({
      ...flow,
      progress,
    });
    course.setInitialFlow(enrichedflow);
    course.setFlow(enrichedflow);
  } else {
    course.setFlow({ ...course.initialFlow });
  }
};

export const buyChapter = async ({ unlockpts, id }) => {
  progressCircle.setShowProgress();
  const courseid = course.state.courseid;
  const { rating, paid } = user.progress;
  await buyChapterCall({
    rating,
    paidchapers: paid,
    courseid,
    unlockpts,
    chapterid: id,
    uid: user.userid,
  });
  await navigator.actions.openAndRefreshFlowPage({
    courseid: course.state.courseid,
    refetchFlow: true,
  });

  progressCircle.closeProgress();
};
