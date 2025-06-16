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
import { updateSCP } from "@/db/localstorage";
import navigator from "@/components/Navigator/store/navigator";
import chapter from "@/components/chapter/store/chapter";
import task from "@/components/chapter/taskrun/store/task";
import flow from "@/components/course/store/course";

const AdminPanel = () => {
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
          const courseid = flow.state.courseid;
          await resetUseMetaData(
            courses[courseid].firstchapter,
            courseid,
            user.userid
          );
          navigator.navMethods.openAndRefreshFlowPage(courseid);
        }}
      >
        reset
      </Button>
      <Button
        onClick={async () => {
          const courseid = flow.state.courseid;
          await unlockAll(
            flow.flow.nodes
              .filter((node) => node.id != -1)
              .map((node) => node.id),
            courses[courseid].firstchapter,
            courseid,
            user.userid
          );
          navigator.navMethods.openAndRefreshFlowPage(courseid);
        }}
      >
        unlockAll
      </Button>
      <Button
        onClick={async () => {
          const courseid = flow.state.courseid;
          await unlockAndCompleteAll(
            flow.flow.nodes
              .filter((node) => node.id != -1)
              .map((node) => node.id),
            courses[courseid].firstchapter,
            courseid,
            user.userid
          );
          navigator.navMethods.openAndRefreshFlowPage(courseid);
        }}
      >
        CompleteAll
      </Button>
      <Button
        onClick={() => {
          load();
          const courseid = flow.state.courseid;
          navigator.navMethods.openAndRefreshFlowPage(courseid);
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
          const courseid = flow.state.courseid;
          await setMoney(courseid, user.userid, inValue);
          navigator.navMethods.openAndRefreshFlowPage(courseid);
        }}
      >
        money2
      </Button>
      <Button
        onClick={() => {
          task.setCurrTask(chapter.allTasks.length - 1);
        }}
      >
        lasttask
      </Button>
    </>
  );
};

export default AdminPanel;
