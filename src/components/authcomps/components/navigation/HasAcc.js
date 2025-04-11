import Typography from "@mui/material/Typography";
import LinkStyled from "@/components/authcomps/components/navigation/link";
import authForm from "@/components/authcomps/store";
import local from "@/globals/local";

export const HasAcc = () => {
  return (
    <Typography sx={{ textAlign: "center" }}>
      {local.ru.text.AUTH_HAVE_ACCOUNT + " "}
      <LinkStyled
        action={() => {
          authForm.showSignIn();
        }}
        title={local.ru.caption.AUTH_SIGNIN}
      />
    </Typography>
  );
};
