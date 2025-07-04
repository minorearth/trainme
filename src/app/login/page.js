"use client";
import * as React from "react";
import { observer } from "mobx-react-lite";
import Splash from "@/components/common/splash/splash";
import AuthSteps from "@/components/authsteps/authsteps";

const Page = observer(() => {
  return (
    <React.Fragment>
      <Splash />
      <AuthSteps />
    </React.Fragment>
  );
});

export default Page;
