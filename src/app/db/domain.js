import { setValueObj, getValueObj } from "./localstorage";
import { getTargetsBySource } from "@/app/flow/utils";

export const saveProgress = async ({ chapter, userid, errors }) => {
  const chaptersUnlocked = getTargetsBySource(chapter);
  const profile = getValueObj("profile");
  setValueObj("profile", {
    unlocked: [...profile.unlocked, ...chaptersUnlocked],
    stats: [...profile.stats, { chapter, errors }],
    userid,
  });
};

export const getProgress = async (userid) => {
  const initialChapter = "1";
  const profile = getValueObj("profile");
  if (!profile) {
    setValueObj("profile", {
      unlocked: [initialChapter],
      stats: [],
      userid,
    });
    return [initialChapter];
  } else {
    return profile.unlocked;
  }
};
