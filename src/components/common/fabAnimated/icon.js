import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const Icon2State = ({ visible, icon }) => {
  if (icon == "support")
    return !visible ? <SupportAgentIcon /> : <SupportAgentIcon />;

  if (icon == "home") return !visible ? <HomeIcon /> : <HomeIcon />;
  if (icon == "close") return !visible ? <ExitToAppIcon /> : <ExitToAppIcon />;
};

export default Icon2State;
