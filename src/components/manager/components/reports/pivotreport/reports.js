import Box from "@mui/material/Box";
import PivotTable from "./pivot";
import stat from "@/components/manager/store/stat";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import usePivotReport from "./pivotVC";
import { IconButton } from "@mui/material";
import MonochromePhotosOutlinedIcon from "@mui/icons-material/MonochromePhotosOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

const PivotReports = observer(() => {
  const { makeSnapshot, showReport } = usePivotReport();

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
          <Box sx={{ flexDirection: "row", display: "flex" }}>
            <IconButton
              size="small"
              onClick={() => {
                showReport(stat.groupSelected);
              }}
              sx={{ color: "text.secondary" }}
            >
              <RefreshOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => makeSnapshot()}
              sx={{ color: "text.secondary" }}
            >
              <MonochromePhotosOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>

          {Object.keys(stat.report).map((courseid) => {
            return (
              <PivotTable
                key={courseid}
                courseid={courseid}
                data={stat.report[courseid]}
              />
            );
          })}
        </Box>
      </Box>
    );
});

export default PivotReports;
