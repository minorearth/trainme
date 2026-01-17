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
import { L } from "@/tpconst/src/lang";

//services(local)
import { recoverPswSubmit } from "@/components/authsteps/layers/services/services";

//stores
import authForm from "@/components/authsteps/layers/store/store";
import { CFT } from "@/components/common/customfield/types";

const PswReset = observer(() => {
  return (
    <Box
      component="form"
      noValidate
      onSubmit={() => recoverPswSubmit()}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1,
        width: "100%",
      }}
    >
      <CustomField type={CFT.email} />
      <Button type="submit" fullWidth variant="contained">
        {L.ru.buttons.AUTH_RESETPSW}
      </Button>
      <CustomLink
        action={() => authForm.showSignIn()}
        title={L.ru.links.AUTH_SIGNIN}
        text={L.ru.links.AUTH_HAVE_ACCOUNT + " "}
      />
    </Box>
  );
});

export default PswReset;
