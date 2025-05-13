// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import { useEffect } from "react";

import {
  setDocInCollectionClient,
  getDocDataFromCollectionByIdClient,
} from "@/db/domain/domain";
import user from "@/store/user";
import { courses, getReadyCourses } from "@/globals/courses";

import { allTasksToObject, getTreeRepresent } from "@/components/manager/utils";
import stat from "@/components/manager/store/stat";

export const useGroupsTreeitem = ({ itemId, uid }) => {
  useEffect(() => {}, []);

  const copyGroupLink = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_DOMAIN}/joingroup/${itemId}/${user.userid}`
    );
  };

  const showUserMeta = async () => {
    const userMeta = await getDocDataFromCollectionByIdClient("usermeta", uid);
    const treeRepresent = getTreeRepresent(
      userMeta.data.courses,
      stat.chaptersobj
    );
    stat.setStat(treeRepresent);
  };

  const showReport = async () => {
    stat.setReport();
  };

  return {
    showUserMeta,
    copyGroupLink,
    showReport,
  };
};
