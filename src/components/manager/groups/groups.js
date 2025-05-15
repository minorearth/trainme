// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { IconButton } from "@mui/material";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { useGroups } from "./groupsVC";
import CustomTreeItem from "@/components/manager/groups/groupItem/groupItem";
import Stat from "@/components/manager/stat/stat";
import PivotTable from "./pivotreport/pivot";
import stat from "../store/stat";
import { observer } from "mobx-react-lite";

const Groups = observer(() => {
  const { changeLabel, addNewGroup, fetchGroupsData } = useGroups();

  return (
    <Box
      sx={{
        flexDirection: "row",
        display: "flex",
        height: "75%",
        width: "75%",
        borderStyle: "solid",
        borderColor: "black",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <Box sx={{ flexDirection: "column", display: "flex" }}>
        <Box sx={{ flexDirection: "row", display: "flex" }}>
          <IconButton
            size="small"
            onClick={addNewGroup}
            sx={{ color: "text.secondary" }}
          >
            <GroupAddOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={fetchGroupsData}
            sx={{ color: "text.secondary" }}
          >
            <RefreshOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>
        <RichTreeView
          sx={{ overflow: "scroll" }}
          slots={{ item: CustomTreeItem }}
          items={stat.groupsdata}
          isItemEditable
          onItemLabelChange={(itemId, label) => changeLabel({ itemId, label })}
        />
      </Box>
      {stat.userstatvisible && <Stat />}
      {stat.reportvisible && <PivotTable />}
    </Box>
  );
});

export default Groups;
