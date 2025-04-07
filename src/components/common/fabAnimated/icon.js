import { TbQrcode } from "react-icons/tb";
import { TbQrcodeOff } from "react-icons/tb";
import { MdSpeakerNotes } from "react-icons/md";
import { MdSpeakerNotesOff } from "react-icons/md";
import SaveIcon from "@mui/icons-material/Save";
import HideImageIcon from "@mui/icons-material/HideImage";
import LinkIcon from "@mui/icons-material/Link";
import UndoIcon from "@mui/icons-material/Undo";
import CropRotateIcon from "@mui/icons-material/CropRotate";
import { BiCategoryAlt } from "react-icons/bi";
import { BiExit } from "react-icons/bi";
import DownloadIcon from "@mui/icons-material/Download";
import LaunchIcon from "@mui/icons-material/Launch";
import { FaHome } from "react-icons/fa";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const Icon2State = ({ visible, icon }) => {
  if (icon == "qr")
    return !visible ? (
      <TbQrcode style={{ fontSize: 30 }} />
    ) : (
      <TbQrcodeOff style={{ fontSize: 30 }} />
    );
  if (icon == "support")
    return !visible ? (
      <SupportAgentIcon style={{ fontSize: 30 }} />
    ) : (
      <SupportAgentIcon style={{ fontSize: 30 }} />
    );

  if (icon == "home")
    return !visible ? (
      <FaHome style={{ fontSize: 30 }} />
    ) : (
      <FaHome style={{ fontSize: 30 }} />
    );
  if (icon == "close")
    return !visible ? (
      <BiExit style={{ fontSize: 30 }} />
    ) : (
      <BiExit style={{ fontSize: 30 }} />
    );
  if (icon == "downloadall")
    return !visible ? (
      <DownloadIcon style={{ fontSize: 30 }} />
    ) : (
      <DownloadIcon style={{ fontSize: 30 }} />
    );
  if (icon == "pickFileType")
    return !visible ? (
      <BiCategoryAlt style={{ fontSize: 30 }} />
    ) : (
      <BiCategoryAlt style={{ fontSize: 30 }} />
    );

  if (icon == "note")
    return !visible ? (
      <MdSpeakerNotes style={{ fontSize: 30 }} />
    ) : (
      <MdSpeakerNotesOff style={{ fontSize: 30 }} />
    );
  if (icon == "saveNote") return <SaveIcon style={{ fontSize: 30 }} />;
  if (icon == "saveImage") return <SaveIcon style={{ fontSize: 30 }} />;
  if (icon == "hideImage") return <HideImageIcon style={{ fontSize: 30 }} />;
  if (icon == "copyClipboard") return <LinkIcon style={{ fontSize: 30 }} />;
  if (icon == "openDropWindow") return <LaunchIcon style={{ fontSize: 30 }} />;

  if (icon == "undo") return <UndoIcon style={{ fontSize: 30 }} />;
  if (icon == "rotate") return <CropRotateIcon style={{ fontSize: 30 }} />;
};

export default Icon2State;
