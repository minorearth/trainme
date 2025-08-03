import { v4 as uuidv4 } from "uuid";

//repository
import { addNewGroupDB, updateNodeLabelDB } from "tpconst/RP/FB";

//stores
import user from "@/auth/store/user";
import stat from "@/components/manager/groupsNreports/store/stat";
import { GroupArr } from "tpconst/T";
import { L } from "tpconst/lang";
import S from "@/globals/settings";

export const addNewGroup = () => {
  const groupid = uuidv4();
  const groupdata = {
    label: L.ru.ST.NEW_GROUP,
    children: {},
    isFolder: true,
    uid: "",
  };
  try {
    addNewGroupDB(groupid, groupdata, user.userid);
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
    `${process.env.NEXT_PUBLIC_DOMAIN}/${S.P.JOINGROUP}/${groupId}/${user.userid}`
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
