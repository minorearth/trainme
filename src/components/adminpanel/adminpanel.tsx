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
  gotoLastTask,
} from "@/components/adminpanel/layers/services/services";

const AdminPanel = () => {
  const [inValue, setInValue] = useState("5000");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInValue(e.target.value);
  };

  return (
    <>
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
      <Button onClick={() => gotoLastTask()}>lasttask</Button>
    </>
  );
};

export default AdminPanel;
