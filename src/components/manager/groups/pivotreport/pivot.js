import React from "react";
import Box from "@mui/material/Box";
import usePivot from "./pivotVC";
import stat from "../../store/stat";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

const PivotTable = observer(({ data }) => {
  console.log("data", toJS(data));
  // const { data1, columns1 } = usePivot({ groupsData });
  // const rows = [
  //   { id: 1, col0: "Иванов Иван", col1: "V", col2: "", col3: "" },
  //   { id: 1, col0: "Иванов Иван", col1: "V", col2: "V", col3: "" },
  //   { id: 1, col0: "Иванов Иван", col1: "V", col2: "", col3: "" },
  //   { id: 1, col0: "Иванов Иван", col1: "V", col2: "V", col3: "V" },
  //   { id: 1, col0: "Иванов Иван", col1: "V", col2: "", col3: "" },
  //   // ...
  // ];

  // const columns = [
  //   { header: "Имя", accessor: "col0" },
  //   { header: "1", accessor: "col1" },
  //   { header: "2", accessor: "col2" },
  //   { header: "3", accessor: "col3" },
  // ];
  console.log("stat.report", toJS(stat.report));

  const cellStyle = {
    border: "1px solid gray",
    width: "30px",
    height: "30px",
    padding: 0,
    margin: 0,
    textAlign: "center",
    boxSizing: "border-box",
    lineHeight: "30px", // чтобы текст был по центру по вертикали
    overflow: "hidden", // чтобы содержимое не растягивалось
  };

  const headerStyle = {
    ...cellStyle,
    backgroundColor: "#f0f0f0",
  };
  return (
    <Box>
      <table
        style={{
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ height: "30px", boxSizing: "border-box" }}>
            {data.cols.map((col) => (
              <th key={col.accessor} style={headerStyle}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr
              key={row.id}
              style={{ height: "30px", boxSizing: "border-box" }}
            >
              {data.cols.map((col, index) => (
                <td
                  key={col.accessor}
                  style={{
                    ...cellStyle,
                    backgroundColor: index === 0 ? "#d0e0f0" : undefined,
                    width: index === 0 ? "300px" : "30px",

                    boxSizing: "border-box",
                  }}
                >
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
});

export default PivotTable;
