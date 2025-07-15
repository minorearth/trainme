import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";

//icons
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

//components
import CustomTreeItem from "@/components/manager/groupsNreports/groups/components/groupItem";

//stores
import stat from "@/components/manager/groupsNreports/store/stat";

const Groups = observer(() => {
  return (
    <Box sx={{ flexDirection: "column", display: "flex", minWidth: "350px" }}>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <IconButton
          size="small"
          onClick={stat.actions.addNewGroup}
          sx={{ color: "text.secondary" }}
        >
          <GroupAddOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={stat.actions.getGroups}
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
        onItemLabelChange={(itemId, label) =>
          stat.actions.changeLabel({ itemId, label })
        }
      />
    </Box>
  );
});

export default Groups;
