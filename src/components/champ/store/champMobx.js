import { toJS } from "mobx";
//react stuff
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//data model
import { setCSP, getCSP, updateSCP } from "@/db/localstorage";
import { signOutUserClient } from "@/db/domain/domain";
import { setDataFetch, getDataFetch } from "@/db/APIcalls/calls";

//

//ViewModel
import { setFlowNodes } from "@/components/Navigator/hooks/courseFlowVM";
import {
  updateChampPoints,
  updateChampTaskLog,
  getUserProgress,
} from "@/components/Navigator/hooks/navigatorVM";
import {
  getAllTasksFromChapter,
  getTasksRecap,
  getTextBook,
  getRandomTasksForRepeat,
  getRandomTasksForChamp,
  getChampTasks,
  finalizePts,
} from "@/components/chapter/store/chapterTasksVM";
//

//utils and constants
import { encrypt2, decrypt2 } from "@/globals/utils/encryption";
import { getReadyCourses } from "@/globals/courses";
import { initials } from "../hooks/initialStates";

//stores
import navigator from "@/components/Navigator/store/navigator";
import task from "@/components/chapter/taskrun/store/task";
import chapter from "@/components/chapter/store/chapter";
import progressStore from "../../common/splash/progressdots/store";
import alertdialog from "@/components/common/dialog/store";
import dialog from "@/components/common/dialog/store";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import user from "@/store/user";
import tutorial from "@/components/tutorial/store";
import flow from "@/components/course/store/course";
//
import {
  setRegularTasks,
  setRandomTasksToRepeat,
  setChampTasks,
  setRecapTasks,
} from "@/components/chapter/store/chapterMobx";

export const openAllCoursePage = () => {
  navigator.setAppState({ ...initials.courses.navigator });
  chapter.setAllTasks([], -1);
};
