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

export const useStat = () => {
  const [data, setData] = useState([]);

  return {
    data,
  };
};
