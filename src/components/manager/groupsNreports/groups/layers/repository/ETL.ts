import { Group, GroupObj } from "@/components/manager/types";

export const groupsObjectToArr = (data: GroupObj) => {
  const arr = Object.keys(data)
    .map((groupkey) => ({
      id: groupkey,
      label: data[groupkey].label,
      isFolder: data[groupkey].isFolder,
      uid: "",
      children: Object.keys(data[groupkey].children)
        .map((userkey) => ({
          id: userkey,
          label: data[groupkey].children[userkey].label,
          isFolder: data[groupkey].children[userkey].isFolder,
          uid: data[groupkey].children[userkey].uid,
          children: [],
        }))
        .sort((a, b) =>
          a.label.toLowerCase().localeCompare(b.label.toLowerCase())
        ),
    }))
    .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
  return arr;
};

export const groupsArrToObject = (data: Group[]) => {
  const obj = data.reduce(
    (acc, item) => ({
      ...acc,
      [item.id]: {
        label: item.label,
        isFolder: item.isFolder,

        children: item.children.reduce(
          (acc, child) => ({
            ...acc,
            [child.id]: {
              label: child.label,
              isFolder: child.isFolder,
              uid: child.uid || NaN,
            },
          }),
          {}
        ),
      },
    }),
    {}
  );
  return obj;
};
