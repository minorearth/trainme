import React from "react";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import styled from "styled-components";
import { courses } from "@/globals/coursesDB";
import { CoursePivotReport } from "tpconst/T";

const PivotTable = observer(
  ({ data, courseid }: { data: CoursePivotReport; courseid: string }) => {
    const Wrapper = styled.div`
      .tooltip {
        position: relative;
        display: inline-block;
        /* border-bottom: 1px dotted black; */
      }

      .tooltip .tooltiptext {
        visibility: hidden;
        /* width: 500px; */
        left: 5px;
        white-space: nowrap;
        max-width: 500px;
        background-color: white;
        color: black;
        text-align: center;
        border-radius: 3px;
        border-color: black;
        border-style: solid;
        padding: 5px;

        /* Position the tooltip */
        position: absolute;
        top: 20px;
        z-index: 100000;
      }

      .tooltip:hover .tooltiptext {
        visibility: visible;
      }
    `;

    const cellStyle: React.CSSProperties = {
      border: "1px solid gray",
      width: "30px",
      height: "30px",
      padding: 0,
      margin: 0,
      textAlign: "center",
      boxSizing: "border-box",
      lineHeight: "30px",
      overflow: "hidden",
    };

    const headerStyle = {
      ...cellStyle,
      backgroundColor: "#f0f0f0",
      overflow: "visible",
      cursor: "pointer",
    };
    return (
      <Box>
        <p>{courses[courseid].title}</p>
        <table
          style={{
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ height: "30px", boxSizing: "border-box" }}>
              {data.cols.map((col) => (
                <th key={col.accessor} style={headerStyle}>
                  <Wrapper>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <p className="tooltip">
                        {col.header}
                        <span className="tooltiptext">{col.title}</span>
                      </p>
                      <span style={{ fontSize: "10px" }}>{col.maxcoins}</span>
                    </div>
                  </Wrapper>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, id) => (
              <tr key={id} style={{ height: "30px", boxSizing: "border-box" }}>
                {data.cols.map((col, index) => (
                  <td
                    key={col.accessor}
                    style={{
                      ...cellStyle,
                      backgroundColor:
                        index === 0 ? "#d0e0f0" : row[col.accessor].completed,

                      width: index === 0 ? "300px" : "30px",

                      boxSizing: "border-box",
                    }}
                  >
                    {row[col.accessor].sum}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    );
  }
);

export default PivotTable;

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
