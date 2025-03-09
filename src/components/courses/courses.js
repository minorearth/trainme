"use client";
import Grid from "@mui/material/Grid2";
import Card from "./course";

const Courses = ({ loadCourse }) => {
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
          loadCourse={loadCourse}
          title={"БАЗОВЫЙ КУРС"}
          text={"Шаг за шаг с нуля познаем основы программирования на Python"}
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
          loadCourse={loadCourse}
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
          loadCourse={loadCourse}
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
