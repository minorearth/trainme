//repository(external)
import { getReadyCourses } from "@/components/courses/layers/repository/repository";
import { getAllTasksDataObj } from "@/components/taskset/layers/repository/repository";

//repository(local)
import {
  getGroupsObj,
  getChaptersObjdata,
} from "@/components/manager/groupsNreports/groups/layers/repository/repository";

//stores
import stat from "@/components/manager/groupsNreports/store/stat";
import user from "@/userlayers/store/user";

export const getAllCoursesTasks = async () => {
  const readyCourses = getReadyCourses();
  let allCoursesTasks = {};
  await Promise.all(
    readyCourses.map(async (courseid) => {
      allCoursesTasks[courseid] = await getAllTasksDataObj(courseid);
    })
  );
  stat.setAllCoursesTasks(allCoursesTasks);
};

export const getGroups = async () => {
  const groupsObj = await getGroupsObj(user.userid);
  stat.setGroupData(groupsObj);
};

export const getChaptersObj = async () => {
  const chaptersObj = await getChaptersObjdata();
  stat.setChaptersObj(chaptersObj);
};
