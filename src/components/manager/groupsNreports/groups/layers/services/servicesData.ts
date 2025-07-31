import { getAllTasksDataObj } from "@/db/repository/repositoryFBCA";
import { getReadyCourses } from "@/db/repository/repositoryLocalFiles";
import {
  getGroupsArr,
  getChaptersObjdata,
} from "@/db/repository/repositoryFBCA";

//stores
import stat from "@/components/manager/groupsNreports/store/stat";
import user from "@/auth/store/user";
import { RawTaskObj } from "tpconst/T";

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
