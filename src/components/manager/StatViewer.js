// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import stat from "@/components/manager/store/stat";
import Typography from "@mui/material/Typography";

const StatViewer = observer(() => {
  return (
    <Box sx={{ minHeight: 352, maxWidth: 450 }}>
      <Typography
        // dangerouslySetInnerHTML={{ __html: `<p>${currTask.task}</p>` }}
        sx={{ display: "inline-block", whiteSpace: "pre-line" }}
      >
        {stat.code}
      </Typography>
    </Box>
  );
});

export default StatViewer;
