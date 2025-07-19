"use client";
import { useRouter } from "next/navigation";
import S from "@/globals/settings";

export default function Home() {
  const router = useRouter();
  // splash.showAppLoader(true);
  router.push(`/${S.P.LOGIN}`);
  // return <Splash />;
}
