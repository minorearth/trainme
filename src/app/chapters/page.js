"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/store/user";
import { observer } from "mobx-react-lite";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";

const Page = observer(({ params }) => {
  const { customTheme } = useCustomTheme();

  return (
    <>
      <ThemeProvider theme={customTheme}>
        {!!user.userid && <Navigator />}
      </ThemeProvider>
    </>
  );
});

export default Page;
