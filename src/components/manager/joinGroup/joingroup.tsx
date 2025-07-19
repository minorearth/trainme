"use client";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";

//hooks
import useJoinGroup from "./joinGroupVC";

//components
import CustomField from "@/components/common/customfield/customField";

//stores
import txtField from "@/components/common/customfield/store";

import L from "@/globals/local";

const Joingroup = observer(
  ({ groupid, manager }: { groupid: string; manager: string }) => {
    const { joinGroup, inviteAccepted } = useJoinGroup();

    return (
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "auto",
          width: "100%",
          flexDirection: "row",
          height: "100vh",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            overflow: "auto",
            width: "30%",
            flexDirection: "column",
            margin: "10px",
            padding: "40px",
            justifyContent: "center",
          }}
        >
          {!inviteAccepted && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "30px",
              }}
            >
              <CustomField type={"firstname"} />
              <CustomField type={"secondname"} />
              <Button
                variant="outlined"
                disabled={
                  txtField.state["firstname"].error ||
                  txtField.state["secondname"].error
                }
                onClick={() => {
                  joinGroup({
                    groupid,
                    manager,
                    secondName: txtField.state["firstname"].value,
                    firstName: txtField.state["secondname"].value,
                  });
                }}
                fullWidth
              >
                {L.ru.buttons.JOIN_GROUP}
              </Button>
            </Box>
          )}
          {inviteAccepted && (
            <Typography sx={{ textAlign: "center" }}>
              {L.ru.text.JOINED_GROUP}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }
);

export default Joingroup;
