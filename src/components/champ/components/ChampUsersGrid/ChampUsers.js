"use client";

import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useColumns } from "./useColumns";
import { observer } from "mobx-react-lite";
import useDashboard from "./dashboardVC";
import { styled } from "@mui/material/styles";

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& .no-rows-primary": {
    fill: "#3D4751",
    ...theme.applyStyles("light", {
      fill: "#AEB8C2",
    }),
  },
  "& .no-rows-secondary": {
    fill: "#1D2126",
    ...theme.applyStyles("light", {
      fill: "#E8EAED",
    }),
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <p>Пока никого</p>
    </StyledGridOverlay>
  );
}

const ChampUsers = observer(({ chapmid }) => {
  const { columns } = useColumns({});

  const { rows } = useDashboard({ chapmid });
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        flex: 1,
      }}
    >
      <DataGrid
        sx={{
          border: 0,
          "& .MuiDataGrid-columnHeaders": {
            display: "none",
          },
        }}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        rows={rows}
        columns={columns}
        initialState={{
          sorting: {
            sortModel: [{ field: "pts", sort: "desc" }],
          },
        }}
        hideFooter
        onProcessRowUpdateError={() => {}}
        // rowSelectionModel={state.rowSelectionModel}
      />
    </Box>
  );
});

export default ChampUsers;
