"use client";
import Grid from "@mui/material/Grid2";
import MonacoEd from "./monaco/MonacoEd";
import CodeRunPanel from "@/components/taskset/taskrun/components/BottomPanel/editor/edditorInout/coderunPanel";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import InOutPanel from "./edditorInout/InoutPanel/InOutPanel";

const CodePanel = observer((props: any) => {
  const { inv, monacostore } = props;
  // const [monacostore] = useState(() => new monaco());

  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, md: 2 }}
      sx={{ width: "100%", height: "100%" }}
    >
      <Grid size={{ xs: 1, md: 2 }}>
        <Box
          sx={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <MonacoEd {...props} monacostore={monacostore} />
          <Box
            sx={{
              flexDirection: "column",
              display: "flex",
              justifyContent: "flex-end",
              justifyItems: "flex-end",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <CodeRunPanel monacostore={monacostore} />
            <InOutPanel inv={inv} monacostore={monacostore} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
});

export default CodePanel;
