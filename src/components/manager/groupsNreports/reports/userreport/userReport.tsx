// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import { toJS } from "mobx";
import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { observer } from "mobx-react-lite";

//components
import CustomStatItem from "@/components/manager/groupsNreports/reports/userreport/components/statItem";
import CodeViewer from "@/components/manager/groupsNreports/reports/userreport/components/CodeViewer";

//stores
import stat from "@/components/manager/groupsNreports/store/stat";

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
            overflow: "scroll",
            minWidth: "450px",
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
