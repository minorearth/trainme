import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import task from "@/components/taskset/taskrun/layers/store/task";
import { updateSCP } from "@/db/localstorage";
import { getStarPageIntro } from "@/components/common/dialog/dialogMacro";
import { Task, TasksetState, TasksetStateChapter } from "@/types";

interface ITask {
  /**
   * Open course flow page
   * @param courseid - course to show.
   * @returns nothing.
   */
  // openAndRefreshFlowPage?: (courseid: string) => void;
}

import { ChapterState } from "@/types";
import { CHAPTER_DEFAULTS } from "@/typesdefaults";

class chapter {
  chapter: ChapterState = CHAPTER_DEFAULTS;

  setChapterid(chapterid: string) {
    this.chapter.chapterid = chapterid;
  }

  setChapter(chapter: ChapterState) {
    this.chapter = chapter;
  }

  setChapterP(chapter: ChapterState) {
    this.chapter = chapter;
    updateSCP({
      chapter,
    });
  }

  eraseStateP() {
    this.chapter = CHAPTER_DEFAULTS;
    updateSCP({
      chapter: {},
    });
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new chapter();
