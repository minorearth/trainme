"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/store/user";
import { observer } from "mobx-react-lite";
import Progress from "@/components/common/progress/progress";
import progressStore from "@/components/common/progress/progressStore";
import { useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "@/app/theme";

const Page = observer(({ params }) => {
  useEffect(() => {
    // progressStore.setShowProgress(true);
    // progressStore.setShowProgress(true, true, "python", 4000);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Progress />
      {/* <CssBaseline /> */}
      {!!user.userid && <Navigator />}
    </ThemeProvider>
  );
});

export default Page;
