import { getDocDataFromCollectionByIdClient } from "@/db/domain/domain";

import { toJS } from "mobx";

import { setDataFetch, getDataFetch } from "@/db/APIcalls/calls";
import { encrypt2 } from "@/globals/utils/encryption";
import { enrichFlowWithUserPorgress } from "@/components/course/store/courseETL";

//stores
import user from "@/store/user";
import course from "@/components/course/store/course";

export const getInitialFlow = async ({ courseid, refetchFlow }) => {
  const flow = refetchFlow ? await fetchFlow({ courseid }) : course.initialFlow;
  course.setInitialFlow(flow);
  return flow;
};

export const getFlow = async ({ courseid, refetchFlow }) => {
  const progress = await user.actions.getUserCourseProgress(courseid);

  const flow = await getInitialFlow({ courseid, refetchFlow });
  const nodes = enrichFlowWithUserPorgress({
    ...flow,
    progress,
  });
  return { flow: { ...flow, nodes }, progress };
};

const fetchFlow = async ({ courseid }) => {
  const data = await getDocDataFromCollectionByIdClient("chapters", courseid);
  const flow = {
    nodes: data.data.chapterFlowNodes,
    edges: data.data.chapterFlowEdges,
  };
  return flow;
};

export const saveProgress = async ({
  courseid,
  chapterid,
  unlocked,
  completed,
  rating,
  lastunlocked,
  tobeunlocked,
  pts,
  repeat,
  sum,
  success,
  uid,
  tasklog,
}) => {
  //TODO: После фейла запроса из-за отсутвия интернета кнока сохранить не нажимается(later)
  let dataToEncrypt;
  const common = {
    lastcompleted: chapterid,
    repeat,
    pts: rating + pts,
    uid,
    tasklog,
    courseid,
    sum: sum + pts,
  };

  if (success) {
    dataToEncrypt = {
      completed: [...completed, chapterid],
      unlocked: tobeunlocked,
      allunlocked: [...unlocked, ...tobeunlocked],
      ...common,
    };
  } else {
    dataToEncrypt = {
      completed,
      unlocked: lastunlocked,
      allunlocked: unlocked,
      ...common,
    };
  }
  const res = await setDataFetch({
    type: "setusermetadata",
    data: encrypt2(dataToEncrypt),
  });
  if (res == "error") {
    throw new Error("Server error");
  }
};
