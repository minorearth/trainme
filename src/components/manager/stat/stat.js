// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { IconButton } from "@mui/material";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { useStat } from "./statVC";
import CustomStatItem from "@/components/manager/stat/statItem/statItem";
import { observer } from "mobx-react-lite";
import stat from "@/components/manager/store/stat";

const MUI_X_PRODUCTS = [
  {
    id: "0",
    label: "Data Grid",
    isFolder: true,
    children: [
      { id: "grid-community", label: "@mui/x-data-grid" },
      { id: "grid-pro", label: "@mui/x-data-grid-pro" },
      { id: "grid-premium", label: "@mui/x-data-grid-premium" },
    ],
  },
  {
    id: "1",
    label: "Date and Time Pickers",
    isFolder: true,
    children: [
      { id: "pickers-community", label: "@mui/x-date-pickers" },
      { id: "pickers-pro", label: "@mui/x-date-pickers-pro" },
    ],
  },
  {
    id: "2",
    label: "Charts",
    isFolder: true,
    children: [{ id: "charts-community", label: "@mui/x-charts" }],
  },
  {
    id: "3",
    label: "Tree View",
    isFolder: true,
    children: [{ id: "tree-view-community", label: "@mui/x-tree-view" }],
  },
];

const Stat = observer(() => {
  const { changeLabel, addNewGroup, data } = useStat();

  return (
    <Box sx={{ minHeight: 352, maxWidth: 450, overflow: "scroll" }}>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        {/* <IconButton
          size="small"
          onClick={addNewGroup}
          sx={{ color: "text.secondary" }}
        >
          <GroupAddOutlinedIcon fontSize="small" />
        </IconButton> */}
      </Box>
      <RichTreeView
        slots={{ item: CustomStatItem }}
        items={stat.userstat}
        // isItemEditable
      />
    </Box>
  );
});

export default Stat;
