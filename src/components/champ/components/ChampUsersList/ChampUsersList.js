import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserCard from "@/components/champ/components/userCard";
import useDashboard from "@/components/champ/components/ChampUsersList/dashboardVC";
import Box from "@mui/material/Box";

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

const SortableList = ({ champid }) => {
  const { rows, started } = useDashboard({ champid });

  const rows2 = [
    { id: 1, name: "Тест 1", pts: 0, change: 0 },
    { id: 2, name: "Тест 2", pts: 0, change: 0 },
    { id: 3, name: "Тест 3", pts: 0, change: 0 },
    { id: 4, name: "Тест 4", pts: 20, change: 0 },
    { id: 5, name: "Тест 5", pts: 21, change: 0 },
    { id: 6, name: "Тест 6", pts: 0, change: 0 },
    { id: 7, name: "Тест 7", pts: 10, change: 0 },
    { id: 8, name: "Тест 8", pts: 0, change: 0 },
    { id: 9, name: "Тест 9", pts: 0, change: 0 },
    { id: 10, name: "Тестsdfa faf 1", pts: 12, change: 0 },
    { id: 11, name: "Тест adfasdfa  1", pts: 0, change: 0 },
    { id: 12, name: "Тестsdf 1", pts: 0, change: 0 },
    { id: 13, name: "Тестsdf 1", pts: 0, change: 0 },
    { id: 14, name: "Тестs 1", pts: 0, change: 0 },
    { id: 15, name: "Тест 1sdf", pts: 0, change: 0 },
    { id: 16, name: "Тест 1sdf", pts: 0, change: 0 },
  ];
  const [items, setItems] = useState(rows);

  const sortItems = () => {
    const sortedItems = [...rows].sort((a, b) => b.pts - a.pts);

    const getItemOldPos = (item, id) => {
      if (!started || item.pts == 0) {
        return 0;
      }
      for (let i = 0; i < items.length; i++) {
        if (items[i].id == item.id) {
          return i - id == 0 ? items[i].change : i - id;
        }
      }
      return 0;
    };

    setItems(
      sortedItems.map((item, id) => ({
        ...item,
        change: getItemOldPos(item, id),
      }))
    );
  };

  useEffect(() => {
    sortItems();
  }, [rows]);

  if (!items.length)
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
        {/* <button onClick={() => sortItems()}>asasdad</button> */}
        {/* <motion.div layout> */}
        {items.map((item, id) => (
          <ListItem
            key={item.id}
            name={item.name}
            pts={item.pts}
            change={item.change}
            avatarid={item.avatarid}
          />
        ))}
        {/* </motion.div> */}
      </AnimatePresence>
    </Box>
  );
};

export default SortableList;
