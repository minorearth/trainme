"use client";
import Grid from "@mui/material/Grid2";
import MonacoEd from "./monaco/MonacoEd";
import CodeRunPanel from "@/components/unitset/unitrun/components/BottomPanel/editor/edditorInout/coderunPanel";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import InOutPanel from "./edditorInout/InoutPanel/InOutPanel";

const CodePanel = observer((props: any) => {
  const { monacoid } = props;
  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, md: 2 }}
      sx={{ width: "100%", height: "100%" }}
    >
      <Grid size={{ xs: 1, md: 2 }}>
        <Box
          key={`codepanel${monacoid}`}
          sx={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <MonacoEd {...props} monacoid={monacoid} />
          <Box
            key={`InOutRunPanel${monacoid}`}
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
            <CodeRunPanel monacoid={monacoid} key={`codePanel${monacoid}`} />
            <InOutPanel monacoid={monacoid} key={`InOutRunPanel${monacoid}`} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
});

export default CodePanel;
