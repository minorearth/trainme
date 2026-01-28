"use client";
import { Button } from "@mui/material";

//react stuff
import Input from "@mui/material/Input";
import { useState } from "react";

//servics(local)
import {
  resetCurrentUser,
  unlockAllChaptersCurrentUser,
  completeAllChaptersCurrentUser,
  setMoneyCurrentUser,
  checkAlltasks,
} from "@/components/adminpanel/layers/services/services";

import task from "@/components/taskset/taskrun/layers/store/task";

import taskset from "@/components/taskset/layers/store/taskset";
import S from "@/globals/settings";
import { L, Task } from "@/tpconst/src";

const AdminPanel = () => {
  const [inValue, setInValue] = useState("5000");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInValue(e.target.value);
  };

  return (
    <>
      <Button onClick={() => checkAlltasks()}>checkAll</Button>
      <Button onClick={() => resetCurrentUser()}>reset</Button>
      <Button onClick={() => unlockAllChaptersCurrentUser()}>unlockAll</Button>
      <Button onClick={() => completeAllChaptersCurrentUser()}>
        CompleteAll
      </Button>
      {/* <Button onClick={() => uploadEverything()}>load</Button> */}
      <Input
        id="standard-multiline-flexible"
        // height="100%"
        // disableUnderline
        onChange={(e) => handleChange(e)}
        value={inValue}
        sx={{
          // display: "inline-block",
          // whiteSpace: "pre-wrap",
          // backgroundColor: "ButtonShadow",
          width: "50px",
        }}
      />
      <Button onClick={() => setMoneyCurrentUser(inValue)}>money</Button>
      <Button onClick={() => taskset.gotoLastTask()}>lasttask</Button>
      {S.mode.DEV_MODE && (
        <Button
          onClick={() => {
            taskset.prevTaskNoPts_admin();
          }}
          variant="outlined"
        >
          {L.ru.buttons.BACK_CHAMP}
        </Button>
      )}

      {S.mode.DEV_MODE && (
        <Button
          onClick={() => {
            task.monaco?.setRightCode_admin((task.currTask as Task).rightcode);
          }}
          variant="outlined"
        >
          RC
        </Button>
      )}
      {S.mode.DEV_MODE && (
        <Button
          onClick={() => {
            task.monaco?.setForbiddenCode_admin(
              (task.currTask as Task).forbiddencode,
            );
          }}
          variant="outlined"
        >
          FC
        </Button>
      )}
    </>
  );
};

export default AdminPanel;
