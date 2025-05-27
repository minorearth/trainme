"use client";
import { Button } from "@mui/material";
import {
  resetUseMetaData,
  unlockAll,
  unlockAndCompleteAll,
  setMoney,
} from "@/db/SA/firebaseSA";
import { load } from "@/components/admin/adminutils";
import user from "@/store/user";
import { courses } from "@/globals/courses";
import Input from "@mui/material/Input";
import { useState } from "react";
import { getCSP } from "@/db/localstorage";

const AdminPanel = ({ flow, actionsNAV, tasks }) => {
  const [inValue, setInValue] = useState(5000);

  const handleChange = (e) => {
    setInValue(e.target.value);
  };

  //DO NOT DEELETE
  // resetUseMetaData(
  //   courses["6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0"].firstchapter,
  //   "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0",
  //   user.userid
  // );

  return (
    <>
      <Button
        onClick={async () => {
          const CSP = getCSP();
          await resetUseMetaData(
            courses[CSP.launchedCourse].firstchapter,
            CSP.launchedCourse,
            user.userid
          );
          actionsNAV.openAndRefreshFlowPage(CSP.launchedCourse);
        }}
      >
        reset
      </Button>
      <Button
        onClick={async () => {
          const CSP = getCSP();
          await unlockAll(
            flow.nodes.filter((node) => node.id != -1).map((node) => node.id),
            courses[CSP.launchedCourse].firstchapter,
            CSP.launchedCourse,
            user.userid
          );
          actionsNAV.openAndRefreshFlowPage(CSP.launchedCourse);
        }}
      >
        unlockAll
      </Button>
      <Button
        onClick={async () => {
          const CSP = getCSP();
          await unlockAndCompleteAll(
            flow.nodes.filter((node) => node.id != -1).map((node) => node.id),
            courses[CSP.launchedCourse].firstchapter,
            CSP.launchedCourse,
            user.userid
          );
          actionsNAV.openAndRefreshFlowPage(CSP.launchedCourse);
        }}
      >
        CompleteAll
      </Button>
      <Button
        onClick={() => {
          const CSP = getCSP();
          load();
          actionsNAV.openAndRefreshFlowPage(CSP.launchedCourse);
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
          const CSP = getCSP();
          await setMoney(CSP.launchedCourse, user.userid, inValue);
          actionsNAV.openAndRefreshFlowPage(CSP.launchedCourse);
        }}
      >
        money2
      </Button>
      <Button
        onClick={() => {
          const CSP = getCSP();
          actionsNAV.setStateAndCSP({ ...CSP, taskId: tasks.length - 1 });
        }}
      >
        lasttask
      </Button>
    </>
  );
};

export default AdminPanel;
