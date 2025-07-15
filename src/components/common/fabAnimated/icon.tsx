import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const Icon2State = ({
  visible,
  icon,
  sx,
}: {
  visible: boolean;
  icon: string;
  sx: React.CSSProperties;
}) => {
  if (icon == "support")
    return !visible ? (
      <SupportAgentIcon sx={{ ...sx }} />
    ) : (
      <SupportAgentIcon sx={{ ...sx }} />
    );

  if (icon == "home")
    return !visible ? <HomeIcon sx={{ ...sx }} /> : <HomeIcon sx={{ ...sx }} />;
  if (icon == "close")
    return !visible ? (
      <ExitToAppIcon sx={{ ...sx }} />
    ) : (
      <ExitToAppIcon sx={{ ...sx }} />
    );
};

export default Icon2State;
