export const groupsArrToObject = (data) => {
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

export const groupsObjectToArr = (data) => {
  const arr = Object.keys(data)
    .map((id) => ({
      id,
      label: data[id].label,
      isFolder: data[id].isFolder,
      children: Object.keys(data[id].children)
        .map((id2) => ({
          id: id2,
          label: data[id].children[id2].label,
          isFolder: data[id].children[id2].isFolder,
          uid: data[id].children[id2].uid,
        }))
        .sort((a, b) =>
          a.label.toLowerCase().localeCompare(b.label.toLowerCase())
        ),
    }))
    .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
  return arr;
};
