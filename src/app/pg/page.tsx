"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/auth/store/user";
import { observer } from "mobx-react-lite";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import { useEffect } from "react";
import { startUidMonitor } from "../../tpconst/src/DB/FB/CA";

import { logout } from "@/globals/next/session";
import PG from "@/components/pg/PG";

import unit from "@/components/unitset/unitrun/layers/store/unit";
import { Panel } from "@/components/common/panel";
import { L } from "@/tpconst/src";

const Page = observer(({}) => {
  const { customTheme } = useCustomTheme();
  useEffect(() => {
    startUidMonitor(
      (id) => user.setUserid(id),
      () => logout(),
    );
    unit.setPGState();
  }, []);

  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        {!!user.userid && unit.editors[0] && (
          <PG key={"Monaco_editor_task"} monacoid={0} errorHandler={() => {}} />
        )}
      </ThemeProvider>
    </>
  );
});

export default Page;
