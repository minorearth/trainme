"use client";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import SortableList from "@/components/champ/components/ChampUsersList/ChampUsersList";
import { observer } from "mobx-react-lite";

const Page = ({ params }) => {
  const { customTheme } = useCustomTheme();
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <SortableList champid={params.champ} />
      </ThemeProvider>
    </>
  );
};

export default Page;
