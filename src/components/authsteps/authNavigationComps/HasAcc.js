import Typography from "@mui/material/Typography";
import LinkStyled from "@/components/authsteps/authNavigationComps/components/link";
import authForm from "@/components/authsteps/layers/store/store";
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
