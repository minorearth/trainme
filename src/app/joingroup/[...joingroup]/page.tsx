"use client";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import Joingroup from "@/components/manager/joinGroup/joingroup";

interface PageProps {
  params: {
    joingroup: [groupid: string, manager: string];
  };
}
export default function Page({ params }: PageProps) {
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
