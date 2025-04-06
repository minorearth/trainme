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
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { useTheme } from "@mui/material/styles";

const AlertDialog = observer(() => {
  const theme = useTheme();

  return (
    <Dialog
      open={alertdialog.dialogState.visible}
      onClose={() => alertdialog.okDialog()}
      maxWidth={"md"}
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
      <DialogTitle>{alertdialog.dialogState.title}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            m: "auto",
            width: "fit-content",
          }}
        >
          <DialogContentText
            sx={{ display: "inline-block", whiteSpace: "pre-line" }}
          >
            {alertdialog.dialogState.text}
          </DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions>
        {alertdialog.dialogState.type == 2 ||
          (alertdialog.dialogState.type == 1 && (
            <Button
              onClick={() => {
                alertdialog.okDialog();
              }}
            >
              {local.ru.caption.ALERT_OK}
            </Button>
          ))}
        {alertdialog.dialogState.type == 2 && (
          <Button onClick={() => alertdialog.cancelDialog()}>{"Отмена"}</Button>
        )}
      </DialogActions>
    </Dialog>
  );
});

export default AlertDialog;
