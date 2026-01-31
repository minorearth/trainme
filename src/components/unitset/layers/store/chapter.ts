import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP } from "@/db/localstorageDB";

import { CHAPTER_DEFAULTS } from "@/tpconst/src/typesdefaults";
import { ChapterStatePersisted } from "@/tpconst/src/T";

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
