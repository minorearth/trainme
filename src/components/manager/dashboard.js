import Box from "@mui/material/Box";
import UserReport from "@/components/manager/components/reports/userreport/userReport";
import { observer } from "mobx-react-lite";
import PivotReports from "@/components/manager/components/reports/pivotreport/reports";
import Groups from "@/components/manager/components/groups/groups";

const DashBoard = observer(() => {
  return (
    <Box
      sx={{
        flexDirection: "row",
        display: "flex",
        height: "100%",
        width: "100%",
        // borderStyle: "solid",
        // borderColor: "black",
        // borderRadius: "10px",
        padding: "20px",
      }}
    >
      <Groups />
      <PivotReports />
      <UserReport />
    </Box>
  );
});

export default DashBoard;
