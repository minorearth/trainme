// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import { useState, useEffect } from "react";

import {
  setDocInCollectionClient,
  getDocDataFromCollectionByIdClient,
} from "@/db/domain/domain";
import { v4 as uuidv4 } from "uuid";
import user from "@/store/user";
import { reaction } from "mobx";

import {
  groupsArrToObject,
  groupsObjectToArr,
} from "@/components/manager/utils";
import stat from "@/components/manager/store/stat";

export const useGroups = () => {
  useEffect(() => {}, []);

  const fetchGroupsData = async () => {
    const groups = await getDocDataFromCollectionByIdClient(
      "groups",
      user.userid
    );
    const data = groupsObjectToArr(groups.data);
    stat.setGroupData(data);
  };

  reaction(
    () => user.userid,
    (userid) => {
      if (userid != "") {
        const getGroups = async () => {
          fetchGroupsData();
          const chaptersObj = await getDocDataFromCollectionByIdClient(
            "views",
            "chaptersobject"
          );
          stat.setChaptersObj(chaptersObj.data);
        };
        getGroups();
      }
    }
  );

  const addNewGroup = () => {
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
    setDocInCollectionClient("groups", groupsArrToObject(data), user.userid);
    return data;
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

  const changeLabel = ({ itemId, label }) => {
    const newdata = updateNodeLabel(stat.groupsdata, itemId, label);
    setDocInCollectionClient("groups", groupsArrToObject(newdata), user.userid);
  };

  return {
    changeLabel,
    addNewGroup,
    fetchGroupsData,
  };
};
