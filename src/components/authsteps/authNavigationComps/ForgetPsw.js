import Typography from "@mui/material/Typography";
import LinkStyled from "@/components/authsteps/authNavigationComps/components/link";
import authForm from "@/components/authsteps/layers/store/store";
import local from "@/globals/local";

export const ForgetPsw = () => {
  return (
    <Typography sx={{ textAlign: "center" }}>
      <LinkStyled
        action={() => {
          authForm.showResetPsw();
        }}
        title={local.ru.text.AUTH_FORGOT}
      />
    </Typography>
  );
};
