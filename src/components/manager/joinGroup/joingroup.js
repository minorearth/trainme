"use client";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import useJoinGroup from "./joinGroupVC";
import Typography from "@mui/material/Typography";

const Joingroup = observer(({ groupid, manager }) => {
  const {
    joinGroup,
    changeFirstName,
    changeSecondName,
    firstName,
    secondName,
    firstNameChecked,
    secondNameChecked,
    inviteAccepted,
  } = useJoinGroup({ groupid, manager });

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
            <TextField
              helperText="Имя с большой буквы"
              id="outlined-basic"
              label="Введите имя"
              variant="outlined"
              onChange={(e) => changeFirstName(e)}
              value={firstName}
              fullWidth
            />
            <TextField
              helperText="Фамилия с большой буквы"
              id="outlined-basic"
              label="Введите Фамилию"
              variant="outlined"
              onChange={(e) => changeSecondName(e)}
              value={secondName}
              fullWidth
            />
            <Button
              variant="outlined"
              disabled={!firstNameChecked || !secondNameChecked}
              onClick={() => {
                joinGroup();
              }}
              fullWidth
            >
              Присоединиться
            </Button>
          </Box>
        )}
        {inviteAccepted && (
          <Typography sx={{ textAlign: "center" }}>
            {"Вы присоединились к группе! Вкладку можно закрыть!"}
          </Typography>
        )}
      </Box>
    </Box>
  );
});

export default Joingroup;
