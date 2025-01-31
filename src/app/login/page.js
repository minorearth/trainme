"use client";
import * as React from "react";
import authForm from "@/store/authentication";
import { observer } from "mobx-react-lite";
import SignIn from "../../components/authcomps/signin";
import SignUp from "../../components/authcomps/signup";
import PswRest from "../../components/authcomps/pswreset";
import Progress from "@/components/common/progress/progress";

const Page = observer(() => {
  return (
    <React.Fragment>
      <Progress />
      {authForm.signIn && <SignIn />}
      {authForm.signUp && <SignUp />}
      {authForm.pswReset && <PswRest />}
    </React.Fragment>
  );
});

export default Page;
