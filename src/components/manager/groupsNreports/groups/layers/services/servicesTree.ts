import { v4 as uuidv4 } from "uuid";

//repository
import {
  addNewGroupDB,
  addNewGroupDB2,
  updateNodeLabelDB,
} from "@/components/manager/groupsNreports/groups/layers/repository/repository";

//stores
import user from "@/userlayers/store/user";
import stat from "@/components/manager/groupsNreports/store/stat";
import { GroupArr } from "@/T/typesDB";

export const addNewGroup = () => {
  const groupid = uuidv4();
  const groupdata = {
    label: "Новая группа",
    children: {},
    isFolder: true,
    uid: "",
  };
  try {
    addNewGroupDB2(groupid, groupdata, user.userid);
    stat.refreshGroupData({ ...groupdata, id: groupid, children: [] });
  } catch (e) {}
};

export const changeLabel = ({
  itemId,
  label,
}: {
  itemId: string;
  label: string;
}) => {
  const newdata = updateNodeLabel({
    nodes: stat.groupsdata,
    id: itemId,
    newLabel: label,
  });
  updateNodeLabelDB(newdata, user.userid);
};

const updateNodeLabel = ({
  nodes,
  id,
  newLabel,
}: {
  nodes: GroupArr[];
  id: string;
  newLabel: string;
}): GroupArr[] => {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, label: newLabel };
    }
    if (node.children.length != 0) {
      return {
        ...node,
        children: updateNodeLabel({
          nodes: node.children,
          id,
          newLabel,
        }),
      };
    }
    return node;
  });
};

export const copyGroupLink = (groupId: string) => {
  navigator.clipboard.writeText(
    `${process.env.NEXT_PUBLIC_DOMAIN}/joingroup/${groupId}/${user.userid}`
  );
};

export const getGroupUsersObj = (groupId: string) => {
  const group = stat.groupsdata.filter((item) => item.id == groupId)[0];
  const users = group.children.reduce(
    (acc, user) => ({
      ...acc,
      [user.uid]: { label: user.label, uid: user.uid },
    }),
    {}
  );
  return users;
};
