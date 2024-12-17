import React, { memo } from "react";
// import { FiCloud } from "react-icons/fi";
import { CiPlay1 } from "react-icons/ci";

import { Handle, Position } from "@xyflow/react";

const TurboNode = memo(({ data }) => {
  return (
    <>
      <div className="cloud gradient">
        <div onClick={() => data.action()}>
          <CiPlay1 />
        </div>
      </div>
      <div className="wrapper gradient">
        <div className="inner">
          <div className="body">
            {data.icon && <div className="icon">{data.icon}</div>}
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
