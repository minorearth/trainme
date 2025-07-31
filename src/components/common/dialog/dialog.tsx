import { observer } from "mobx-react-lite";

import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";

//stores
import alertdialog from "@/components/common/dialog/store";

//components
import DialogWrapper from "./dialogWrapper";

//globals
import { L } from "tpconst/lang";

const AlertDialog = observer(() => {
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
            {L.ru.buttons.ALERT_OK}
          </Button>
        )}
        {alertdialog.dialogState.type == 2 && (
          <Button onClick={() => alertdialog.cancelDialog()}>
            {L.ru.buttons.ALERT_CANCEL}
          </Button>
        )}
      </DialogActions>
    </DialogWrapper>
  );
});

export default AlertDialog;
