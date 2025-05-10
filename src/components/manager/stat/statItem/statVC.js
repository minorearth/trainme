// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import { useEffect } from "react";

import {
  setDocInCollectionClient,
  getDocDataFromCollectionByIdClient,
} from "@/db/domain/domain";
import user from "@/store/user";
import { courses, getReadyCourses } from "@/globals/courses";

import { allTasksToObject } from "@/components/manager/utils";

export const useGroupsTreeitem = ({ itemId, uid }) => {
  useEffect(() => {}, []);

  const showUserMeta = async () => {};

  return {
    showUserMeta,
  };
};
