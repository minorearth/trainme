import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { IconButton } from "@mui/material";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { useGroups } from "./groupsVC";
import CustomTreeItem from "@/components/manager/components/groups/groupItem/groupItem";
import stat from "@/components/manager/store/stat";
import { observer } from "mobx-react-lite";

const Groups = observer(() => {
  const { changeLabel, addNewGroup, fetchGroupsData } = useGroups();

  return (
    <Box sx={{ flexDirection: "column", display: "flex", minWidth: "350px" }}>
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
  );
});

export default Groups;
