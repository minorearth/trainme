import { setValueObj, getValueObj } from "./localstorage";
import { getTargetsBySource } from "@/components/Navigator/utils";

// export const saveChapterCompleted = async ({
//   chapter,
//   userid,
//   errors,
//   nextchapters,
//   pts,
// }) => {
//   const profile = getValueObj("profile");
//   // setValueObj("profile", {
//   //   unlocked: [...nextchapters],
//   //   completed: [...profile.completed, chapter],
//   //   stats: [...profile.stats, { chapter, errors }],
//   //   currentchapter: chapter,
//   //   userid,
//   // });
//   return nextchapters;
// };

// export const getProgress = async (userid) => {
//   const initialChapter = "1";
//   const profile = getValueObj("profile");
//   if (!profile) {
//     const newProfile = {
//       unlocked: [initialChapter],
//       completed: [],
//       stats: [],
//       currentchapter: initialChapter,
//       userid,
//     };
//     setValueObj("profile", newProfile);
//     return newProfile;
//   } else {
//     return profile;
//   }
// };
