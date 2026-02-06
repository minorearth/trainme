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

import unit from "@/components/unitset/unitrun/layers/store/unit";

import unitset from "@/components/unitset/layers/store/unitset";
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
      <Button
        onClick={() =>
          window.navigator.clipboard.writeText(unit.currUnit.unituuid)
        }
      >
        ID
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
      <Button onClick={() => unitset.gotoLastUnit()}>lasttask</Button>
      {S.mode.DEV_MODE && (
        <Button
          onClick={() => {
            unitset.prevUnitNoPts_admin();
          }}
          variant="outlined"
        >
          {L.ru.buttons.BACK_ADMIN}
        </Button>
      )}
      {S.mode.DEV_MODE && (
        <Button
          onClick={() => {
            unitset.nextUnitNoPts_admin();
          }}
          variant="outlined"
        >
          {L.ru.buttons.FWD_ADMIN}
        </Button>
      )}

      {S.mode.DEV_MODE && (
        <Button
          onClick={() => {
            unit.setRightCode_admin((unit.currUnit as Task).rightcode);
          }}
          variant="outlined"
        >
          RC
        </Button>
      )}
      {S.mode.DEV_MODE && (
        <Button
          onClick={() => {
            unit.setForbiddenCode_admin((unit.currUnit as Task).forbiddencode);
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
