import Typography from "@mui/material/Typography";
import LinkStyled from "@/components/authsteps/authNavigationComps/components/link";
import authForm from "@/components/authsteps/layers/store/store";
import local from "@/globals/local";

export const ShowSignUp = () => {
  return (
    <Typography sx={{ textAlign: "center" }}>
      {local.ru.text.AUTH_HAVE_NOACCOUNT + " "}
      <LinkStyled
        action={() => {
          authForm.showSignUp();
        }}
        title={local.ru.caption.AUTH_SIGNUP}
      />
    </Typography>
  );
};
