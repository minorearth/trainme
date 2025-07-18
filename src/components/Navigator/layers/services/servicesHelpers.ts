//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import task from "@/components/taskset/taskrun/layers/store/task";
import taskset from "@/components/taskset/layers/store/taskset";
import user from "@/userlayers/store/user";
import course from "@/components/course/layers/store/course";
import champ from "@/components/champ/layers/store/champ";
import chapter from "@/components/taskset/layers/store/chapter";
import { CourseProgressDB } from "@/T/typesDB";

//

export const setChampPageState = () => {
  course.eraseStateP();
  taskset.eraseTaskSetStateP();
  task.eraseState();
  chapter.eraseStateP();
  navigator.setStateP({ page: "champ" });
};

export const setFlowPageState = ({
  courseid,
  progress,
}: {
  courseid: string;
  progress: CourseProgressDB;
}) => {
  course.setStateP({ ...course.state, courseid });
  navigator.setStateP({ page: "flow" });
  taskset.eraseTaskSetStateP();
  task.eraseState();
  chapter.eraseStateP();
  user.setProgressP(progress);
};

export const setAllCoursePageState = () => {
  navigator.setStateP({ page: "courses" });
  course.eraseStateP();
  champ.eraseStateP();
  taskset.eraseTaskSetStateP();
  chapter.eraseStateP();
  task.eraseState();
};
