"use client";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import { Panel } from "@/components/common/formcontrol";
import Input from "@mui/material/Input";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";
import Card from "./course";

const Courses = ({ showCourse }) => {
  //   const { currTask, refreshInput } = props;
  //   const [inValue, setInValue] = useState(currTask.input);

  //   const handleChange = (e) => {
  //     currTask.input = e.target.value;
  //     setInValue(e.target.value);
  //   };

  //   useEffect(() => {
  //     setInValue(currTask.input);
  //   }, [currTask]);

  return (
    <Grid
      container
      spacing={2}
      columns={{ sm: 1, lg: 3 }}
      sx={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        height: "100%",
      }}
    >
      <Grid
        size={{ sm: 1, md: 1 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card
          showCourse={showCourse}
          title={"БАЗОВЫЙ КУРС"}
          text={"Шаг за шаг с нуля познаем основы проограммирования на Python"}
        />
      </Grid>
      <Grid
        size={{ sm: 1, md: 1 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card
          showCourse={showCourse}
          title={"ПРОДВИНУТОЕ ПРОГРАММИРОВАНИЕ"}
          text={"Постигааем продвинутые функции языка Python"}
        />
      </Grid>
      <Grid
        size={{ sm: 1, md: 1 }}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Card
          showCourse={showCourse}
          title={"ГОТОВИМСЯ К ЕГЭ"}
          text={
            "Подготовка к решению задач ЕГЭ. Все типы задач. Разные способы решения - от Базового до Pro"
          }
        />
      </Grid>
    </Grid>
  );
};

export default Courses;
