import Box from "@mui/material/Box";
import PivotTable from "./pivot";
import stat from "@/components/manager/store/stat";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import usePivot from "./pivotVC";

const Reports = observer(() => {
  const { makeSnapshot } = usePivot();

  if (stat.reportvisible)
    return (
      <Box sx={{ overflow: "scroll" }}>
        <Box
          sx={{
            flexDirection: "column",
            display: "flex",
            width: "2000px",
            alignItems: "flex-start",
          }}
        >
          <Button onClick={() => makeSnapshot()}>Сделать снимок</Button>
          {Object.keys(stat.report).map((courseid) => (
            <PivotTable key={courseid} data={stat.report[courseid]} />
          ))}
        </Box>
      </Box>
    );
});

export default Reports;
