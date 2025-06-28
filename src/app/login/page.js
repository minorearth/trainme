"use client";
import * as React from "react";
import { observer } from "mobx-react-lite";
import Progress from "@/components/common/splash/progressdots/progressdots";
import AuthSteps from "@/components/authsteps/authsteps";

const Page = observer(() => {
  return (
    <React.Fragment>
      <Progress />
      <AuthSteps />
    </React.Fragment>
  );
});

export default Page;
