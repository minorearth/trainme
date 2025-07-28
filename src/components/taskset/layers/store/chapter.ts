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

import { CHAPTER_DEFAULTS } from "tpconst/typesdefaults";
import { ChapterStatePersisted } from "tpconst/T";

class chapter {
  state: ChapterStatePersisted = CHAPTER_DEFAULTS;

  setChapterid(chapterid: string) {
    this.state.chapterid = chapterid;
  }

  setChapterState(chapter: ChapterStatePersisted) {
    this.state = chapter;
  }

  setChapterStateP(chapter: ChapterStatePersisted) {
    this.state = chapter;
    updateSCP({
      chapter,
    });
  }

  eraseStateP() {
    this.state = CHAPTER_DEFAULTS;
    updateSCP({
      chapter: CHAPTER_DEFAULTS,
    });
  }

  constructor() {
    makeAutoObservable(this);
  }
}

const instance = new chapter();

export default instance;
