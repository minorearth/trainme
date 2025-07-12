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
import { CourseProgress } from "@/types";

interface getFlow {
  courseid: string;
  refetchFlow: boolean;
  progress: CourseProgress;
}

export const getFlow = async ({ courseid, refetchFlow, progress }: getFlow) => {
  if (refetchFlow) {
    const flow = await fetchFlow({ courseid });
    const enrichedflow = enrichFlowWithUserProgress({
      ...flow,
      progress,
    });
    course.setInitialFlow(enrichedflow);
    course.setFlow(enrichedflow);
    console.log("enrichedflow", enrichedflow);
  } else {
    course.setFlow({ ...course.initialFlow });
  }
};

export const buyChapter = async ({
  unlockpts,
  chapterid,
}: {
  unlockpts: number;
  chapterid: string;
}) => {
  progressCircle.setShowProgress();
  const courseid = course.state.courseid;
  const { rating, paid } = user.progress;
  await buyChapterCall({
    rating,
    paidchapers: paid,
    courseid,
    unlockpts,
    chapterid,
    uid: user.userid,
  });
  await navigator.actions.openAndRefreshFlowPage({
    courseid: course.state.courseid,
    refetchFlow: true,
  });

  progressCircle.closeProgress();
};
