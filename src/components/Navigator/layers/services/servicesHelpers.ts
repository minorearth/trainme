//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import unitset from "@/components/unitset/layers/store/unitset";
import user from "@/auth/store/user";
import course from "@/components/course/layers/store/course";
import champ from "@/components/champ/layers/store/champ";
import chapter from "@/components/unitset/layers/store/chapter";
import { CourseProgressDB } from "@/tpconst/src/T";
import { PG } from "@/tpconst/src/const";

//

export const setChampPageState = () => {
  course.eraseStateP();
  unitset.eraseTaskSetStateP();
  unit.eraseState();
  chapter.eraseStateP();
  navigator.setStateP({ page: PG.champ });
};

export const setFlowPageState = ({
  courseid,
  progress,
}: {
  courseid: string;
  progress: CourseProgressDB;
}) => {
  course.setStateP({ ...course.state, courseid });
  navigator.setStateP({ page: PG.flow });
  unitset.eraseTaskSetStateP();
  unit.eraseState();
  chapter.eraseStateP();
  user.setProgressP(progress);
};

export const setAllCoursePageState = () => {
  navigator.setStateP({ page: PG.courses });
  course.eraseStateP();
  champ.eraseStateP();
  unitset.eraseTaskSetStateP();
  chapter.eraseStateP();
  unit.eraseState();
};
