"use client";
import * as React from "react";
import { observer } from "mobx-react-lite";
import AuthSteps from "@/components/authsteps/authsteps";
import splash from "@/components/common/splash/store";

const Page = observer(() => {
  // import splash from "@/components/common/splash/store"

  return <AuthSteps />;
});

export default Page;
