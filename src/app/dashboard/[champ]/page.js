"use client";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import SortableList from "@/components/champ/components/ChampUsersList/ChampUsersList";
import { observer } from "mobx-react-lite";
import useDashboard from "@/components/champ/hooks/dashboardVC";

const Page = ({ params }) => {
  const { customTheme } = useCustomTheme();
  useDashboard({ champid: params.champ });
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <SortableList />
      </ThemeProvider>
    </>
  );
};

export default Page;
