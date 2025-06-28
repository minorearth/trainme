"use client";
import * as React from "react";
import authForm from "@/components/authsteps/layers/store/store";
import { observer } from "mobx-react-lite";
import SignIn from "@/components/authsteps/steps/signin";
import SignUp from "@/components/authsteps/steps/signup";
import PswRest from "@/components/authsteps/steps/pswreset";

const Authsteps = observer(() => {
  return (
    <React.Fragment>
      {authForm.signIn && <SignIn />}
      {authForm.signUp && <SignUp />}
      {authForm.pswReset && <PswRest />}
    </React.Fragment>
  );
});

export default Authsteps;
