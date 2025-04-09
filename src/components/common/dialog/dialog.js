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
import DialogWrapper from "./dialogWrapper";

import { useTheme } from "@mui/material/styles";

const AlertDialog = observer(() => {
  const theme = useTheme();

  return (
    <DialogWrapper
      onClose={() => alertdialog.okDialog()}
      open={alertdialog.dialogState.visible}
    >
      <DialogTitle>{alertdialog.dialogState.title}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            m: "auto",
            width: "fit-content",
            // display: "inline-block",
            // whiteSpace: "pre-line",
          }}
        >
          {/* {alertdialog.dialogState.text} */}
          <DialogContentText
            sx={{ display: "inline-block", whiteSpace: "pre-line" }}
          >
            {alertdialog.dialogState.text}
          </DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions>
        {(alertdialog.dialogState.type == 2 ||
          alertdialog.dialogState.type == 1) && (
          <Button
            onClick={() => {
              alertdialog.okDialog();
            }}
          >
            {local.ru.caption.ALERT_OK}
          </Button>
        )}
        {alertdialog.dialogState.type == 2 && (
          <Button onClick={() => alertdialog.cancelDialog()}>{"Отмена"}</Button>
        )}
      </DialogActions>
    </DialogWrapper>
  );
});

export default AlertDialog;
