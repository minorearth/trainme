//repository(external)
import { getReadyCourses } from "@/components/courses/layers/repository/repository";
import { getAllTasksDataObj } from "@/components/taskset/layers/repository/repository";

//repository(local)
import {
  getGroupsArr,
  getChaptersObjdata,
} from "@/components/manager/groupsNreports/groups/layers/repository/repository";

//stores
import stat from "@/components/manager/groupsNreports/store/stat";
import user from "@/userlayers/store/user";
import { RawTaskObj } from "@/types";

export const getAllCoursesTasks = async () => {
  const readyCourses = getReadyCourses();
  let allCoursesTasksObj: { [key: string]: RawTaskObj } = {};
  await Promise.all(
    readyCourses.map(async (courseid) => {
      allCoursesTasksObj[courseid] = await getAllTasksDataObj(courseid);
    })
  );
  stat.setAllCoursesTasksObj(allCoursesTasksObj);
};

export const getGroups = async () => {
  const groupsArr = await getGroupsArr(user.userid);
  stat.setGroupData(groupsArr);
};

export const getChaptersObj = async () => {
  const chaptersObj = await getChaptersObjdata();
  stat.setChaptersObj(chaptersObj);
};
