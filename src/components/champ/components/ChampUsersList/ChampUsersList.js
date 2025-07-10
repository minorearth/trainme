import { toJS } from "mobx";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";

//components
import UserCard from "@/components/champ/components/UserCard";

//stores
import champ from "@/components/champ/layers/store/champ";

const ListItem = ({ key, name, pts, change, avatarid }) => (
  <motion.div
    layout
    key={key}
    transition={{ type: "spring", stiffness: 100, damping: 50, duration: 5 }}
    style={{
      margin: "10px",
      padding: "10px",
      // background: "#f0f0f0",
      border: "1px solid #ccc",
      borderRadius: "5px",
    }}
  >
    <UserCard name={name} pts={pts} change={change} avatarid={avatarid} />
  </motion.div>
);

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
        Ожидаем участников...
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
        {champ.users.map((item, id) => (
          <ListItem
            key={item.id}
            name={item.name}
            pts={item.pts}
            change={item.change}
            avatarid={item.avatarid}
          />
        ))}
      </AnimatePresence>
    </Box>
  );
});

export default SortableList;
