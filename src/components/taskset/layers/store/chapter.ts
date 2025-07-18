import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import task from "@/components/taskset/taskrun/layers/store/task";
import { updateSCP } from "@/db/localstorage";

interface ITask {
  /**
   * Open course flow page
   * @param courseid - course to show.
   * @returns nothing.
   */
  // openAndRefreshFlowPage?: (courseid: string) => void;
}

import { CHAPTER_DEFAULTS } from "@/T/typesdefaults";
import { ChapterStatePersisted } from "@/T/typesState";

class chapter {
  chapter: ChapterStatePersisted = CHAPTER_DEFAULTS;

  setChapterid(chapterid: string) {
    this.chapter.chapterid = chapterid;
  }

  setChapter(chapter: ChapterStatePersisted) {
    this.chapter = chapter;
  }

  setChapterP(chapter: ChapterStatePersisted) {
    this.chapter = chapter;
    updateSCP({
      chapter,
    });
  }

  eraseStateP() {
    this.chapter = CHAPTER_DEFAULTS;
    updateSCP({
      chapter: CHAPTER_DEFAULTS,
    });
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new chapter();
