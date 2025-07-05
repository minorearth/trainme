"use client";
import { observer } from "mobx-react-lite";

//react stuff
import * as React from "react";
import { useEffect } from "react";

//components
import SignIn from "@/components/authsteps/components/signin";
import SignUp from "@/components/authsteps/components/signup";
import PswRest from "@/components/authsteps/components/pswreset";
import Splash from "@/components/common/splash/splash";
import AlertDialog from "@/components/common/dialog/dialog";

//stores
import authForm from "@/components/authsteps/layers/store/store";
import splash from "@/components/common/splash/store";

const Authsteps = observer(() => {
  useEffect(() => {
    splash.closeProgress();
  }, []);

  return (
    <React.Fragment>
      <Splash />
      <AlertDialog />
      {authForm.signIn && <SignIn />}
      {authForm.signUp && <SignUp />}
      {authForm.pswReset && <PswRest />}
    </React.Fragment>
  );
});

export default Authsteps;
