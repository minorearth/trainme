import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import snack from "@/store/snack";
import { observer } from "mobx-react-lite";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}
const Snack = observer(() => {
  return (
    <Snackbar
      open={snack.snackState.visible}
      onClose={() => snack.closeSnack()}
      TransitionComponent={SlideTransition}
      message={snack.snackState.text}
      key="snack"
      autoHideDuration={1000}
    />
  );
});

export default Snack;
