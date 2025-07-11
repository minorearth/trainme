import { Champuser } from "@/types";

interface GetChange {
  champstarted: boolean;
  oldusers: Champuser[];
  positionInNewUserArray: number;
  user: Champuser;
}

const getChange = ({
  user,
  positionInNewUserArray,
  champstarted,
  oldusers,
}: GetChange) => {
  if (champstarted || user.pts == 0) {
    return 0;
  }
  for (let i = 0; i < oldusers.length; i++) {
    if (oldusers[i].uid == user.uid) {
      return i - positionInNewUserArray == 0
        ? oldusers[i].change
        : i - positionInNewUserArray;
    }
  }
  return 0;
};

export const sortItems = ({
  newusers,
  champstarted,
  oldusers,
}: {
  newusers: Champuser[];
  champstarted: boolean;
  oldusers: Champuser[];
}) => {
  const newUsersSorted = [...newusers].sort((a, b) => b.pts - a.pts);
  return newUsersSorted.map((user, id) => ({
    ...user,
    change: getChange({
      user,
      positionInNewUserArray: id,
      champstarted,
      oldusers,
    }),
  }));
};
