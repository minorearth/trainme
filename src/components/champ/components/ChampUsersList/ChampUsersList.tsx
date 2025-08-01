import { toJS } from "mobx";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";

//components
import UserCard from "@/components/champ/components/CardUser";

//stores
import champ from "@/components/champ/layers/store/champ";
import { ChampuserDB } from "tpconst/T";

import { L } from "tpconst/lang";

const ListItem = ({ user }: { user: ChampuserDB }) => {
  const { uid } = user;
  return (
    <motion.div
      layout
      key={`${uid}motion`}
      transition={{ type: "spring", stiffness: 100, damping: 50, duration: 5 }}
      style={{
        margin: "10px",
        padding: "10px",
        // background: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
      <UserCard user={user} />
    </motion.div>
  );
};

const SortableList = observer(() => {
  if (!champ.users.length)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        {L.ru.text.WAITING_FOR_PAARTICIPANTS}
      </Box>
    );
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "70%",
        justifySelf: "center",
        // gap: "20px",
        // alignItems: "center",
        // justifyContent: "space-between",
      }}
    >
      <AnimatePresence>
        {champ.users.map((user) => (
          <ListItem key={user.uid} user={user} />
        ))}
      </AnimatePresence>
    </Box>
  );
});

export default SortableList;
