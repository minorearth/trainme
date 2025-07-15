import Fab from "@mui/material/Fab";
import Icon2State from "./icon";
import { Tooltip } from "@mui/material";

const FabAnimated = ({
  action,
  icon,
  style,
  tooltip,
}: {
  action: () => void;
  icon: string;
  style: React.CSSProperties;
  tooltip: string;
}) => {
  return (
    <Tooltip title={tooltip}>
      <Fab
        sx={{
          color: "inherit",
          "&:hover": {
            opacity: 0.7,
          },
          "&:active": {
            opacity: 0.9,
          },
          position: "absolute",
          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
          background:
            "linear-gradient(135deg,rgb(18, 33, 130) 0%,rgb(255, 46, 112) 100%)",
          ...style,
        }}
        onClick={() => action()}
      >
        <Icon2State
          visible={true}
          icon={icon}
          sx={{ fontSize: "35px", color: "white" }}
        />
      </Fab>
    </Tooltip>
  );
};

export default FabAnimated;
