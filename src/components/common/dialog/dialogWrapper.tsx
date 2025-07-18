import Dialog from "@mui/material/Dialog";
import { Breakpoint } from "@mui/system";

import { observer } from "mobx-react-lite";

import { useTheme } from "@mui/material/styles";

interface DialogWrapper {
  children: React.ReactNode;
  maxWidth?: Breakpoint;
  fullWidth?: boolean;
  onClose: () => void;
  open: boolean;
}
const DialogWrapper = observer(
  ({
    children,
    maxWidth = "sm" as Breakpoint,
    fullWidth = false,
    onClose,
    open,
  }: DialogWrapper) => {
    const theme = useTheme();

    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        sx={{
          "& .MuiPaper-root": {
            backgroundImage:
              "conic-gradient(  #e92a67,#a853ba,#2a8af6, #2a8af600,  #e92a67)",
            padding: "3px",
            // animation: "spinner 4s linear infinite",
          },

          "& @keyframes spinner": {
            "100%": {
              transform: "translate(-50%, -50%) rotate(-360deg)",
            },
          },
          "& .MuiTypography-root": {
            backgroundColor: theme.palette.background.default,
          },
          "& .MuiDialogContent-root": {
            backgroundColor: theme.palette.background.default,
          },
          "& .MuiDialogActions-root": {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        {children}
      </Dialog>
    );
  }
);

export default DialogWrapper;
