
export const getTargetsBySource = (src,edges) => {
  return edges.filter((edge) => edge.source == src).map((edge) => edge.target);
};
