"use client";
import { useRouter } from "next/navigation";
import Splash from "@/components/common/splash/splash";
import splash from "@/components/common/splash/store";

export default function Home() {
  const router = useRouter();
  // splash.showAppLoader(true);
  router.push("/login");
  // return <Splash />;
}
