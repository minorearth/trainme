"use client";
import * as React from "react";
import { observer } from "mobx-react-lite";
import AuthSteps from "@/components/authsteps/authsteps";

const Page = observer(() => {
  return <AuthSteps />;
});

export default Page;
