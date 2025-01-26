import Typography from "@mui/material/Typography";
import LinkStyled from "@/components/authcomps/components/navigation/link";
import authForm from "@/store/authentication";
import local from "@/globals/local";

export const ForgetPsw = () => {
  return (
    <Typography sx={{ textAlign: "center" }}>
      <LinkStyled
        action={() => {
          authForm.showResetPsw(authForm.state["email"].value);
        }}
        title={local.ru.text.AUTH_FORGOT}
      />
    </Typography>
  );
};
