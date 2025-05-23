// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import CustomStatItem from "@/components/manager/components/reports/userreport/statItem/statItem";
import { observer } from "mobx-react-lite";
import stat from "@/components/manager/store/stat";
import CodeViewer from "@/components/manager/components/reports/userreport/CodeViewer";

const UserReport = observer(() => {
  if (stat.userstatvisible) {
    return (
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
          // height: "100",
        }}
      >
        <Box
          sx={{
            minHeight: 352,
            overflow: "scroll",
          }}
        >
          <RichTreeView
            // sx={{ overflow: "scroll" }}
            slots={{ item: CustomStatItem }}
            items={stat.userstat}
          />
        </Box>
        <CodeViewer />
      </Box>
    );
  }
});

export default UserReport;
