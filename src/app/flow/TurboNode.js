import React, { memo } from "react";
// import { FiCloud } from "react-icons/fi";
import { CiPlay1 } from "react-icons/ci";

import { Handle, Position } from "@xyflow/react";
import FunctionIcon from "./FunctionIcon.js";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const TurboNode = memo(({ data }) => {
  return (
    <>
      <div className="cloud gradient">
        <div style={{ width: "30px" }}>
          <IconButton
            sx={{
              width: "20px",
              height: "20px",
              padding: "1px",
              // "&:hover": { color: "green" },
              backgroundColor: "white",
            }}
            aria-label="delete"
            color="primary"
            onClick={() => data.action(data.id)}
          >
            <PlayArrowIcon />
          </IconButton>
        </div>
      </div>
      <div className="wrapper gradient">
        <div className="inner">
          <div className="body">
            <div className="icon">
              <FunctionIcon />
            </div>
            <div>
              <pre>
                <div className="title">{data.title}</div>
              </pre>
              {data.subline && <div className="subline">{data.subline}</div>}
            </div>
          </div>
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </div>
      </div>
    </>
  );
});
TurboNode.displayName = "TurboNode";
export default TurboNode;
