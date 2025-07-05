"use client";
import { observer } from "mobx-react-lite";

//reeact stuff
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

//components
import { CustomLink } from "@/components/authsteps/components/customLink";
import CustomField from "@/components/common/customfield/customField";

//globals
import local from "@/globals/local";

//services(local)
import { recoverPswSubmit } from "@/components/authsteps/layers/services/services";

//stores
import authForm from "@/components/authsteps/layers/store/store";

const PswReset = observer(() => {
  return (
    <Box
      component="form"
      noValidate
      onSubmit={(event) => recoverPswSubmit(event)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1,
        width: "100%",
      }}
    >
      <CustomField type={"email"} />
      <Button type="submit" fullWidth variant="contained">
        {local.ru.caption.AUTH_RESETPSW}
      </Button>
      <CustomLink
        action={() => authForm.showSignIn()}
        title={local.ru.caption.AUTH_SIGNIN}
        text={local.ru.text.AUTH_HAVE_ACCOUNT + " "}
      />
    </Box>
  );
});

export default PswReset;
