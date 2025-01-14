"use client";
import * as React from "react";
import authenticationForm from "@/store/authentication";
import { observer } from "mobx-react-lite";
import SignIn from "./components/signin";
import SignUp from "./components/signup";
import PswRest from "./components/pswreset";

const Page = observer(() => {
  return (
    <>
      {authenticationForm.signIn && <SignIn />}
      {authenticationForm.signUp && <SignUp />}
      {authenticationForm.pswReset && <PswRest />}
    </>
  );
});

export default Page;
