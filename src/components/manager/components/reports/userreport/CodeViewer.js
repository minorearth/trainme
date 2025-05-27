// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import stat from "@/components/manager/store/stat";
import Typography from "@mui/material/Typography";

const CodeViewer = observer(() => {
  return (
    <Box sx={{ minHeight: 352, overflow: "scroll" }}>
      <Typography
        variant="body1"
        // dangerouslySetInnerHTML={{ __html: `<p>${currTask.task}</p>` }}
        sx={{ whiteSpace: "pre-wrap" }}
      >
        {stat.code}
      </Typography>
    </Box>
  );
});

export default CodeViewer;
