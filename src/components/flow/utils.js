import { initialEdges } from "./data";

export const getTargetsBySource = (src) => {
  return initialEdges
    .filter((edge) => edge.source == src)
    .map((edge) => edge.target);
};
