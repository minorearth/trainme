"use client";
import { useRouter } from "next/navigation";
import S from "@/globals/settings";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  // splash.showAppLoader(true);
  useEffect(() => {
    router.push(`/login`);
  }, []);
  // return <Splash />;
}
