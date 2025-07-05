export const sortItems = ({ newusers, champstarted, oldusers }) => {
  const sortedItems = [...newusers].sort((a, b) => b.pts - a.pts);

  const getChange = (item, id) => {
    if (champstarted || item.pts == 0) {
      return 0;
    }
    for (let i = 0; i < oldusers.length; i++) {
      if (oldusers[i].id == item.id) {
        return i - id == 0 ? oldusers[i].change : i - id;
      }
    }
    return 0;
  };

  return sortedItems.map((item, id) => ({
    ...item,
    change: getChange(item, id),
  }));
};
