"use client";
import { Button } from "@mui/material";

import {
  uploadEverything,
  resetCurrentUser,
  unlockAllChapters,
  completeAllChapters,
  setMoney,
  gotoLastTask,
} from "@/components/admin/layers/services/services";

//react stuff
import Input from "@mui/material/Input";
import { useState } from "react";

const AdminPanel = () => {
  const [inValue, setInValue] = useState(5000);

  const handleChange = (e) => {
    setInValue(e.target.value);
  };

  return (
    <>
      <Button onClick={() => resetCurrentUser()}>reset</Button>
      <Button onClick={() => unlockAllChapters()}>unlockAll</Button>
      <Button onClick={() => completeAllChapters()}>CompleteAll</Button>
      <Button onClick={() => uploadEverything()}>load</Button>
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
      <Button onClick={() => setMoney(inValue)}>money</Button>
      <Button onClick={() => gotoLastTask()}>lasttask</Button>
    </>
  );
};

export default AdminPanel;
