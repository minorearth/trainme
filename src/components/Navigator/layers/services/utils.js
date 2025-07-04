//utils and constants
import { initials } from "@/components/Navigator/layers/store/initialStates";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import task from "@/components/taskset/taskrun/layers/store/task";
import taskset from "@/components/taskset/layers/store/taskset";
import user from "@/userlayers/store/user";
import course from "@/components/course/layers/store/course";
import champ from "@/components/champ/layers/store/champ";
//

export const setChampPageState = () => {
  course.eraseStateP();
  taskset.eraseStateP();
  task.eraseStateP();
  navigator.setStateP({ ...initials.champlauncher.navigator });
};

export const setFlowPageState = ({ courseid, progress }) => {
  course.updateStateP({ courseid });
  navigator.updateStateP({ page: "flow" });
  taskset.eraseStateP();
  task.eraseStateP();
  user.setProgressP(progress);
};

export const setAllCoursePageState = () => {
  navigator.setStateP({ ...initials.courses.navigator });
  course.eraseStateP();
  champ.eraseStateP();
  taskset.eraseStateP();
  task.eraseStateP();
};
