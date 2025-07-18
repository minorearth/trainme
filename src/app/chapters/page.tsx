"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/userlayers/store/user";
import { observer } from "mobx-react-lite";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";

const Page = observer(({}) => {
  const { customTheme } = useCustomTheme();
  console.log("render2", user.userid);

  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        {!!user.userid && <Navigator />}
      </ThemeProvider>
    </>
  );
});

export default Page;
