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
import taskset from "@/components/taskset/layers/store/taskset";
import task from "@/components/taskset/taskrun/store/task";
import course from "@/components/course/store/course";

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
          await resetUseMetaData(
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
          await unlockAll(
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
        unlockAll
      </Button>
      <Button
        onClick={async () => {
          const courseid = course.state.courseid;
          await unlockAndCompleteAll(
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
          await setMoney(courseid, user.userid, inValue);
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
          task.setCurrTask(taskset.allTasks.length - 1);
        }}
      >
        lasttask
      </Button>
    </>
  );
};

export default AdminPanel;
