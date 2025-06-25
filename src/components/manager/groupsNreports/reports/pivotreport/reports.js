import Box from "@mui/material/Box";
import PivotTable from "./components/pivot";
import stat from "@/components/manager/groupsNreports/store/stat";
import { observer } from "mobx-react-lite";
import { IconButton } from "@mui/material";
import MonochromePhotosOutlinedIcon from "@mui/icons-material/MonochromePhotosOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";

const PivotReports = observer(() => {
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
                stat.actions.showReport(stat.groupSelected);
              }}
              sx={{ color: "text.secondary" }}
            >
              <RefreshOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => stat.actions.makeSnapshot()}
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
