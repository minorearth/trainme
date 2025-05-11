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

import { arrToObject, objectToArr } from "@/components/manager/utils";
import store from "@/components/manager/store/stat";

export const useGroups = () => {
  const [groupsData, setGroupsData] = useState([]);

  useEffect(() => {}, []);

  const fetchGroupsData = async () => {
    const groups = await getDocDataFromCollectionByIdClient(
      "groups",
      user.userid
    );
    setGroupsData(objectToArr(groups.data));
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
          store.setChaptersObj(chaptersObj.data);
        };
        getGroups();
      }
    }
  );

  const addNewGroup = () => {
    setGroupsData((prev) => {
      const data = [
        ...prev,
        {
          id: uuidv4(),
          label: "Новая группа",
          children: [],
          isFolder: true,
        },
      ];
      setDocInCollectionClient("groups", arrToObject(data), user.userid);
      return data;
    });
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
    const newdata = updateNodeLabel(groupsData, itemId, label);
    setDocInCollectionClient("groups", arrToObject(newdata), user.userid);
  };

  return {
    changeLabel,
    addNewGroup,
    groupsData,
    fetchGroupsData,
  };
};
