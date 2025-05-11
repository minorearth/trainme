// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { IconButton } from "@mui/material";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { useGroups } from "./groupsVC";
import CustomTreeItem from "@/components/manager/groups/groupItem/groupItem";
import Stat from "@/components/manager/stat/stat";
import StatViewer from "@/components/manager/StatViewer";

export default function Groups() {
  const { changeLabel, addNewGroup, groupsData } = useGroups();

  return (
    <Box sx={{ flexDirection: "row", display: "flex" }}>
      <Box sx={{ flexDirection: "column", display: "flex" }}>
        <Box sx={{ flexDirection: "row", display: "flex" }}>
          <IconButton
            size="small"
            onClick={addNewGroup}
            sx={{ color: "text.secondary" }}
          >
            <GroupAddOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <RichTreeView
          slots={{ item: CustomTreeItem }}
          items={groupsData}
          isItemEditable
          onItemLabelChange={(itemId, label) => changeLabel({ itemId, label })}
        />
      </Box>
      <Stat />
      <StatViewer />
    </Box>
  );
}
