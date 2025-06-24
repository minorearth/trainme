export const sortItems = ({ users, setItems, champstarted, items }) => {
  const sortedItems = [...users].sort((a, b) => b.pts - a.pts);

  const getChange = (item, id) => {
    if (champstarted || item.pts == 0) {
      return 0;
    }
    for (let i = 0; i < items.length; i++) {
      if (items[i].id == item.id) {
        return i - id == 0 ? items[i].change : i - id;
      }
    }
    return 0;
  };

  setItems(
    sortedItems.map((item, id) => ({
      ...item,
      change: getChange(item, id),
    }))
  );
};

export const sortItems2 = ({ users, champstarted, items }) => {
  const sortedItems = [...users].sort((a, b) => b.pts - a.pts);

  const getChange = (item, id) => {
    if (champstarted || item.pts == 0) {
      return 0;
    }
    for (let i = 0; i < items.length; i++) {
      if (items[i].id == item.id) {
        return i - id == 0 ? items[i].change : i - id;
      }
    }
    return 0;
  };

  return sortedItems.map((item, id) => ({
    ...item,
    change: getChange(item, id),
  }));
};
