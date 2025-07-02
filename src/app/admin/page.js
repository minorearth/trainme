"use client";
import { Button } from "@mui/material";
import { load } from "@/components/admin/layers/services/loader";
import progressStore from "@/components/common/splash/progressdots/store";
import Progress from "@/components/common/splash/progressdots/progressdots";

const Page = ({ params }) => {
  return (
    <>
      <Progress />
      <Button
        onClick={async () => {
          progressStore.setShowProgress(true);
          await load();
          progressStore.setCloseProgress();
        }}
      >
        load
      </Button>
    </>
  );
};

export default Page;
