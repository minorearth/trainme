"use client";

import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useColumns } from "./useColumns";
import { observer } from "mobx-react-lite";

const ChampUsers = observer(({ rows }) => {
  const { columns } = useColumns({});
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
        rows={rows}
        columns={columns}
        // initialState={{
        //   sorting: {
        //     sortModel: [{ field: "datetime", sort: "desc" }],
        //   },
        // }}
        onProcessRowUpdateError={() => {}}
        // rowSelectionModel={state.rowSelectionModel}
      />
    </Box>
  );
});

export default ChampUsers;
