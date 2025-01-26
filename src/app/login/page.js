"use client";
import * as React from "react";
import authForm from "@/store/authentication";
import { observer } from "mobx-react-lite";
import SignIn from "../../components/authcomps/signin";
import SignUp from "../../components/authcomps/signup";
import PswRest from "../../components/authcomps/pswreset";

const Page = observer(() => {
  return (
    <>
      {authForm.signIn && <SignIn />}
      {authForm.signUp && <SignUp />}
      {authForm.pswReset && <PswRest />}
    </>
  );
});

export default Page;
