import Typography from "@mui/material/Typography";
import LinkStyled from "@/components/authcomps/components/navigation/link";
import authForm from "@/components/authcomps/store";
import local from "@/globals/local";

export const RecallPsw = () => {
  return (
    <Typography sx={{ textAlign: "center" }}>
      {local.ru.text.AUTH_REMEMBER + " "}
      <LinkStyled
        action={() => {
          authForm.showSignIn();
        }}
        title={local.ru.caption.AUTH_SIGNIN}
      />
    </Typography>
  );
};
