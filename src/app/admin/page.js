"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/userlayers/store/user";
import { observer } from "mobx-react-lite";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import AdminPanel from "@/components/admin/adminpanel";

const Page = observer(({ params }) => {
  const { customTheme } = useCustomTheme();

  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        {/* <Navigator> */}
        {/* <AdminPanel flow={flow}  tasks={tasks} /> */}
        {/* </Navigator> */}
      </ThemeProvider>
    </>
  );
});

export default Page;
