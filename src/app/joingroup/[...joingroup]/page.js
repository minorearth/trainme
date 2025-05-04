"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/store/user";
import { observer } from "mobx-react-lite";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import ChampUsers from "@/components/champ/components/ChampUsersGrid/ChampUsers";
import Groups from "./joingroup";
import Joingroup from "./joingroup";

export default function Page({ params }) {
  const { customTheme } = useCustomTheme();
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Joingroup
          groupid={params.joingroup[0]}
          manager={params.joingroup[1]}
        />
      </ThemeProvider>
    </>
  );
}
