import { v4 as uuidv4 } from "uuid";

//repository
import {
  addNewGroupDB,
  updateNodeLabelDB,
} from "@/components/manager/groupsNreports/groups/layers/repository/repository";

//stores
import user from "@/userlayers/store/user";
import stat from "@/components/manager/groupsNreports/store/stat";

import { Group, GroupUser } from "@/components/manager/types";

export const addNewGroup = () => {
  const data = [
    ...stat.groupsdata,
    {
      id: uuidv4(),
      label: "Новая группа",
      children: [],
      isFolder: true,
    },
  ];
  stat.setGroupData(data);
  addNewGroupDB(data, user.userid);
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
  nodes: Group[];
  id: string;
  newLabel: string;
}): Group[] | GroupUser[] => {
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
        }) as GroupUser[],
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
