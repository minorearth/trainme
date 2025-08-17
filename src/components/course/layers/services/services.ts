import { toJS } from "mobx";

//repository(local)
import { getFlowDB } from "tpconst/RP/FB";
import { buyChapterCall } from "@/app/api/apicalls/dataFetch";

//stores
import course from "@/components/course/layers/store/course";
import user from "@/auth/store/user";
import navigator from "@/components/Navigator/layers/store/navigator";
import splash from "@/components/common/splash/store";

//service helpers
import { enrichFlowWithUserProgress } from "@/components/course/layers/services/servicesHelpers";
import { CourseProgressDB } from "tpconst/T";

export const getFlow = async ({
  courseid,
  refetchFlow,
  progress,
}: {
  courseid: string;
  refetchFlow: boolean;
  progress: CourseProgressDB;
}) => {
  if (refetchFlow) {
    const flow = await getFlowDB({ courseid });
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

export const buyChapter = async ({
  unlockpts,
  chapterid,
}: {
  unlockpts: number;
  chapterid: string;
}) => {
  splash.showProgress();
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

  splash.closeProgress();
};
