"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/store/user";
import { observer } from "mobx-react-lite";
import Progress from "@/components/common/progress/progress";
import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "@/app/theme";

const Page = observer(({ params }) => {
  return (
    <>
      {/* // <ThemeProvider theme={darkTheme}> */}
      {!!user.userid && <Navigator />}
      {/* // </ThemeProvider> */}
    </>
  );
});

export default Page;
