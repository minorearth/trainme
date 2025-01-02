"use client";
import Navigator from "@/components/Navigator/navigator";
import Countdown from "@/components/common/countdown/countdown";
import { initAdmin } from "@/db/firebaseAdmin";

export default function Page({ params }) {
  return <Navigator />;
  // return <Stopwatch />;
}
