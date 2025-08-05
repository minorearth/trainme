"use client";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import SortableList from "@/components/champ/components/ChampUsersList/ChampUsersList";
import useDashboard from "@/components/champ/hooks/useDashboard";
import YookassaPayment from "@/app/robokassa/YookassaPayment";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { customTheme } = useCustomTheme();

  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <YookassaPayment id={params.id} />
      </ThemeProvider>
    </>
  );
};

export default Page;
