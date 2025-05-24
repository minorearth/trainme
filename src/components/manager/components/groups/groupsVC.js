import {
  setDocInCollectionClient,
  getDocDataFromCollectionByIdClient,
  getDocDataFromSubCollectionByIdClient,
} from "@/db/domain/domain";
import { v4 as uuidv4 } from "uuid";
import user from "@/store/user";
import { reaction } from "mobx";

import { groupsArrToObject, groupsObjectToArr } from "./utils";
import stat from "@/components/manager/store/stat";
import { useEffect } from "react";
import { courses, getReadyCourses } from "@/globals/courses";

export const useGroups = () => {
  const allTasksArrToObj = (allTasks) => {
    const alltasksObj = allTasks.data.tasks.reduce(
      (acc, task) => ({
        ...acc,
        [task.taskuuid]: { task: task.task, id: task.id },
      }),
      {}
    );

    return alltasksObj;
  };

  useEffect(() => {
    const readyCourses = getReadyCourses();
    let allCoursesTasks = {};

    const getAllTasksData = async (courseid) => {
      const allTasks = await getDocDataFromSubCollectionByIdClient(
        "newtasks",
        courseid,
        "chapters",
        "alltasks"
      );
      const allTasksObj = allTasksArrToObj(allTasks);
      allCoursesTasks[courseid] = allTasksObj;
    };

    const getAllCousesTasks = async () => {
      await Promise.all(
        readyCourses.map(async (courseid) => {
          await getAllTasksData(courseid);
        })
      );
      stat.setAllCoursesTasks(allCoursesTasks);
    };
    getAllCousesTasks();
  }, []);

  const fetchGroupsData = async () => {
    const groups = await getDocDataFromCollectionByIdClient(
      "groups",
      user.userid
    );
    const data = groupsObjectToArr(groups.data);
    stat.setGroupData(data);
  };

  reaction(
    () => user.userid,
    (userid) => {
      if (userid != "") {
        const getGroups = async () => {
          fetchGroupsData();
          const chaptersObj = await getDocDataFromCollectionByIdClient(
            "views",
            "chaptersobject"
          );
          stat.setChaptersObj(chaptersObj.data);
        };
        getGroups();
      }
    }
  );

  const addNewGroup = () => {
    const data = [
      ...stat.groupsdata,
      {
        id: uuidv4(),
        label: "Новая группа",
        children: [],
        isFolder: true,
      },
    ];
    stat.setGroupData(data);
    setDocInCollectionClient("groups", groupsArrToObject(data), user.userid);
    return data;
  };

  const updateNodeLabel = (nodes, id, newLabel) => {
    return nodes.map((node) => {
      if (node.id === id) {
        return { ...node, label: newLabel };
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodeLabel(node.children, id, newLabel),
        };
      }
      return node;
    });
  };

  const changeLabel = ({ itemId, label }) => {
    const newdata = updateNodeLabel(stat.groupsdata, itemId, label);
    setDocInCollectionClient("groups", groupsArrToObject(newdata), user.userid);
  };

  return {
    changeLabel,
    addNewGroup,
    fetchGroupsData,
  };
};
