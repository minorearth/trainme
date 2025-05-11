"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/store/user";
import { observer } from "mobx-react-lite";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import ChampUsers from "@/components/champ/components/ChampUsersGrid/ChampUsers";
import Groups from "../../components/manager/groups/groups";
import Box from "@mui/material/Box";

export default function Page({ params }) {
  const { customTheme } = useCustomTheme();
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Groups />
      </Box>
    </ThemeProvider>
  );
}
