"use client";
import { Button } from "@mui/material";
import {
  resetUseMetaData,
  unlockAll,
  unlockAndCompleteAll,
  getMoney,
  setMoney,
} from "@/db/SA/firebaseSA";
import { load } from "@/components/admin/adminutils";
import { courses } from "@/globals/courses";
import Input from "@mui/material/Input";
import { useState } from "react";

const AdminPanel = ({ flow, appState, actions }) => {
  const [inValue, setInValue] = useState(5000);

  const handleChange = (e) => {
    setInValue(e.target.value);
  };

  return (
    <>
      <Button
        onClick={async () => {
          await resetUseMetaData(
            courses[appState.launchedCourse].firstchapter,
            appState.launchedCourse,
            appState.uid
          );
          actions.openAndRefreshFlowPage(appState.launchedCourse);
        }}
      >
        reset
      </Button>
      <Button
        onClick={async () => {
          await unlockAll(
            flow.nodes.filter((node) => node.id != -1).map((node) => node.id),
            courses[appState.launchedCourse].firstchapter,
            appState.launchedCourse,
            appState.uid
          );
          actions.openAndRefreshFlowPage(appState.launchedCourse);
        }}
      >
        unlockAll
      </Button>
      <Button
        onClick={async () => {
          await unlockAndCompleteAll(
            flow.nodes.filter((node) => node.id != -1).map((node) => node.id),
            courses[appState.launchedCourse].firstchapter,
            appState.launchedCourse,
            appState.uid
          );
          actions.openAndRefreshFlowPage(appState.launchedCourse);
        }}
      >
        CompleteAll
      </Button>
      <Button
        onClick={() => {
          load();
          actions.openAndRefreshFlowPage(appState.launchedCourse);
        }}
      >
        load
      </Button>
      <Input
        id="standard-multiline-flexible"
        height="100%"
        disableUnderline
        onChange={(e) => handleChange(e)}
        value={inValue}
        sx={{
          display: "inline-block",
          whiteSpace: "pre-wrap",
          backgroundColor: "ButtonShadow",
          width: "50px",
        }}
      />
      <Button
        onClick={async () => {
          await setMoney(appState.launchedCourse, appState.uid, inValue);
          actions.openAndRefreshFlowPage(appState.launchedCourse);
        }}
      >
        money2
      </Button>
      <Button
        onClick={() => {
          actions.changeState({ taskId: 7 });
        }}
      >
        lasttask
      </Button>
    </>
  );
};

export default AdminPanel;
