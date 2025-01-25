"use client";
import { Button } from "@mui/material";
import {
  resetUseMetaData,
  unlockAll,
  unlockAndCompleteAll,
} from "@/db/SA/firebaseSA";
import { load } from "@/components/admin/adminutils";

const AdminPanel = ({ flow }) => {
  return (
    <>
      <Button
        onClick={() => {
          resetUseMetaData();
        }}
      >
        reset
      </Button>
      <Button
        onClick={() => {
          unlockAll(
            flow.nodes.filter((node) => node.id != -1).map((node) => node.id)
          );
        }}
      >
        unlockAll
      </Button>
      <Button
        onClick={() => {
          unlockAndCompleteAll(
            flow.nodes.filter((node) => node.id != -1).map((node) => node.id)
          );
        }}
      >
        CompleteAll
      </Button>
      <Button
        onClick={() => {
          load();
        }}
      >
        load
      </Button>
    </>
  );
};

export default AdminPanel;
