// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import { useEffect } from "react";
import stat from "@/components/manager/store/stat";

export const useStatTreeitem = ({ code }) => {
  useEffect(() => {}, []);

  const showCode = async () => {
    stat.setCode(code);
  };

  return {
    showCode,
  };
};
