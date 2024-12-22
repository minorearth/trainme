import { setValueObj, getValueObj } from "./localstorage";
import { getTargetsBySource } from "@/app/flow/utils";

export const saveProgress = async ({ chapter, userid, errors }) => {
  const chaptersUnlocked = getTargetsBySource(chapter);
  const profile = getValueObj("profile");
  setValueObj("profile", {
    unlocked: [...profile.unlocked, ...chaptersUnlocked],
    stats: [...profile.stats, { chapter, errors }],
    currentchapter: chapter,
    userid,
  });
};

export const getProgress = async (userid) => {
  const initialChapter = "1";
  const profile = getValueObj("profile");
  if (!profile) {
    const newProfile = {
      unlocked: [initialChapter],
      stats: [],
      currentchapter: initialChapter,
      userid,
    };
    setValueObj("profile", newProfile);
    return newProfile;
  } else {
    return profile;
  }
};
