// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { IconButton } from "@mui/material";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { useStat } from "./statVC";
import CustomStatItem from "@/components/manager/components/stat/statItem/statItem";
import { observer } from "mobx-react-lite";
import stat from "@/components/manager/store/stat";
import StatViewer from "@/components/manager/StatViewer";

const Stat = observer(() => {
  if (stat.userstatvisible) {
    return (
      <Box sx={{ minHeight: 352, overflow: "scroll" }}>
        <Box sx={{ flexDirection: "row", display: "flex" }}>
          <RichTreeView
            slots={{ item: CustomStatItem }}
            items={stat.userstat}
            // isItemEditable
          />
          <StatViewer />
        </Box>
      </Box>
    );
  }
});

export default Stat;
