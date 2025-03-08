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
          id={"6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0"}
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
          id={"a3905595-437e-47f3-b749-28ea5362bd39"}
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
          id={"6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0"}
        />
      </Grid>
    </Grid>
  );
};

export default Courses;
