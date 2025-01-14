"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/store/user";
import { observer } from "mobx-react-lite";

const Page = observer(({ params }) => {
  return !!user.userid && <Navigator />;
});

export default Page;
