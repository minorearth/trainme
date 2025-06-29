"use client";
import { Button } from "@mui/material";
import {
  resetUserMetaData_admin,
  unlockAll_admin,
  unlockAndCompleteAll_admin,
  setMoney_admin,
} from "@/db/SA/firebaseSA";
import { load } from "@/components/admin/layers/services/services";
import { courses } from "@/globals/courses";
import Input from "@mui/material/Input";
import { useState } from "react";

import navigator from "@/components/Navigator/layers/store/navigator";
import taskset from "@/components/taskset/layers/store/taskset";
import task from "@/components/taskset/taskrun/layers/store/task";
import course from "@/components/course/layers/store/course";
import user from "@/userlayers/store/user";

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
          const courseid = course.state.courseid;
          await resetUserMetaData_admin(
            courses[courseid].firstchapter,
            courseid,
            user.userid
          );
          navigator.actions.openAndRefreshFlowPage({
            courseid,
            refetchFlow: true,
          });
        }}
      >
        reset
      </Button>
      <Button
        onClick={async () => {
          const courseid = course.state.courseid;
          await unlockAll_admin({
            //TODO: remade unclocked
            unlocked: course.flow.nodes
              .filter((node) => node.id != -1)
              .map((node) => node.id),
            lastunlocked: courses[courseid].firstchapter,
            courseid,
            uid: user.userid,
          });
          navigator.actions.openAndRefreshFlowPage({
            courseid,
            refetchFlow: true,
          });
        }}
      >
        unlockAll
      </Button>
      <Button
        onClick={async () => {
          const courseid = course.state.courseid;
          await unlockAndCompleteAll_admin(
            course.flow.nodes
              .filter((node) => node.id != -1)
              .map((node) => node.id),
            courses[courseid].firstchapter,
            courseid,
            user.userid
          );
          navigator.actions.openAndRefreshFlowPage({
            courseid,
            refetchFlow: true,
          });
        }}
      >
        CompleteAll
      </Button>
      <Button
        onClick={() => {
          load();
          const courseid = course.state.courseid;
          navigator.actions.openAndRefreshFlowPage({
            courseid,
            refetchFlow: true,
          });
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
          const courseid = course.state.courseid;
          await setMoney_admin(courseid, user.userid, inValue);
          navigator.actions.openAndRefreshFlowPage({
            courseid,
            refetchFlow: true,
          });
        }}
      >
        money2
      </Button>
      <Button
        onClick={() => {
          task.setCurrTaskP(taskset.allTasks.length - 1);
        }}
      >
        lasttask
      </Button>
    </>
  );
};

export default AdminPanel;
