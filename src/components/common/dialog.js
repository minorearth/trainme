import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { observer } from "mobx-react-lite";
import alertdialog from "@/store/dialog";
import local from "@/globals/local";
import GradientBox from "@/components/gradientBox";
import { Box } from "@mui/material";
import "./dialog.css";

const AlertDialog = observer(() => {
  return (
    <Dialog
      open={alertdialog.dialogState.visible}
      onClose={() => alertdialog.closeDialog()}
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
        // "& .MuiPaper-root::before": {
        //   content: "''",
        //   position: "absolute",
        //   height: "100%",
        //   width: "100%",
        //   top: "40%",
        //   left: "50%",
        //   translate: "-50% -50%",

        //   backgroundImage:
        //     "conic-gradient(  #e92a67,#a853ba,#2a8af6, #2a8af600,  #e92a67)",
        //   filter: "blur(15rem)",
        //   padding: "5px",
        //   // zIndex: "-1",
        // },
        "& .MuiTypography-root": { backgroundColor: "black" },
        "& .MuiDialogContent-root": { backgroundColor: "black" },
        "& .MuiDialogActions-root": { backgroundColor: "black" },
      }}
    >
      <DialogTitle>{alertdialog.dialogState.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{alertdialog.dialogState.text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => alertdialog.closeDialog()} autoFocus>
          {local.ru.caption.ALERT_OK}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default AlertDialog;
