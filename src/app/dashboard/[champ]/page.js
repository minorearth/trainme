"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/store/user";
import { observer } from "mobx-react-lite";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import ChampUsers from "@/legacy/ChampUsersGrid/ChampUsers";
import SortableList from "@/components/champ/components/ChampUsersList/ChampUsersList";

export default function Page({ params }) {
  const { customTheme } = useCustomTheme();
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        {/* <ChampUsers champid={params.champ} /> */}
        <SortableList champid={params.champ} />
      </ThemeProvider>
    </>
  );
}
