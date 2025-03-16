"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/store/user";
import { observer } from "mobx-react-lite";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import ChampUsers from "@/components/champ/components/ChampUsersGrid/ChampUsers";

export default function Page({ params }) {
  const { customTheme } = useCustomTheme();
  console.log(params);
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <ChampUsers chapmid={params.champ} />
      </ThemeProvider>
    </>
  );
}
