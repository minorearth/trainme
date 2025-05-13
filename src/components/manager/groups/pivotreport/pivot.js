import React from "react";
import Box from "@mui/material/Box";

const PivotTable = () => {
  const data = [
    { id: 1, col0: "Иванов Иван", col1: "V", col2: "", col3: "" },
    { id: 1, col0: "Иванов Иван", col1: "V", col2: "V", col3: "" },
    { id: 1, col0: "Иванов Иван", col1: "V", col2: "", col3: "" },
    { id: 1, col0: "Иванов Иван", col1: "V", col2: "V", col3: "V" },
    { id: 1, col0: "Иванов Иван", col1: "V", col2: "", col3: "" },
    // ...
  ];

  const columns = [
    { header: "Имя", accessor: "col0" },
    { header: "1", accessor: "col1" },
    { header: "2", accessor: "col2" },
    { header: "3", accessor: "col3" },
  ];

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
          height: "auto",
        }}
      >
        <thead>
          <tr style={{ height: "30px", boxSizing: "border-box" }}>
            {columns.map((col) => (
              <th key={col.accessor} style={headerStyle}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              style={{ height: "30px", boxSizing: "border-box" }}
            >
              {columns.map((col, index) => (
                <td
                  key={col.accessor}
                  style={{
                    ...cellStyle,
                    backgroundColor: index === 0 ? "#d0e0f0" : undefined,
                    width: index === 0 ? "200px" : "30px",

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
};

export default PivotTable;
