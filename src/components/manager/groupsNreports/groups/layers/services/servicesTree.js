import { v4 as uuidv4 } from "uuid";

//repository
import {
  addNewGroupDB,
  updateNodeLabelDB,
} from "@/components/manager/groupsNreports/groups/layers/repository/repository";

//stores
import user from "@/userlayers/store/user";
import stat from "@/components/manager/groupsNreports/store/stat";

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

export const changeLabel = ({ itemId, label }) => {
  const newdata = updateNodeLabel(stat.groupsdata, itemId, label);
  updateNodeLabelDB(newdata, user.userid);
};

const updateNodeLabel = (nodes, id, newLabel) => {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, label: newLabel };
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeLabel(node.children, id, newLabel),
      };
    }
    return node;
  });
};

export const copyGroupLink = (itemId) => {
  navigator.clipboard.writeText(
    `${process.env.NEXT_PUBLIC_DOMAIN}/joingroup/${itemId}/${user.userid}`
  );
};

export const getGroupUsersObj = (itemId) => {
  const group = stat.groupsdata.filter((item) => item.id == itemId)[0];
  const users = group.children.reduce(
    (acc, item) => ({
      ...acc,
      [item.uid]: { label: item.label, uid: item.uid },
    }),
    {}
  );
  return users;
};
