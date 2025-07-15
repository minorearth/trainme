import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";

//components
import UserReport from "@/components/manager/groupsNreports/reports/userreport/userReport";
import PivotReports from "@/components/manager/groupsNreports/reports/pivotreport/reports";
import Groups from "@/components/manager/groupsNreports/groups/groups";

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
