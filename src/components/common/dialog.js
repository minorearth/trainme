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

const AlertDialog = observer(() => {
  return (
    <Dialog
      open={alertdialog.dialogState.visible}
      onClose={() => alertdialog.closeDialog()}
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
