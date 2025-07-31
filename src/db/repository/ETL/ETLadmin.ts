import { NodeDB } from "tpconst/T";

export const extractChapterIdsOnly_admin = (chapterFlowNodes: NodeDB[]) => {
  return chapterFlowNodes.map((node) => node.id).filter((id) => id[0] != "-");
};
