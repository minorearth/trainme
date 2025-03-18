"use client";
import Grid from "@mui/material/Grid2";
import Card from "./course";

const Courses = ({ actions }) => {
  const coursesData = [
    {
      title: "БАЗОВЫЙ КУРС",
      text: "Шаг за шаг с нуля познаем основы программирования на Python",
      id: "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0",
      action: actions.handleCourseClick,
    },

    {
      title: "ПРОДВИНУТОЕ ПРОГРАММИРОВАНИЕ",
      text: "Постигааем продвинутые функции языка Python",
      id: "a3905595-437e-47f3-b749-28ea5362bd39",
      action: actions.handleCourseClick,
    },
    {
      title: "ГОТОВИМСЯ К ЕГЭ",
      text: "Подготовка к решению задач ЕГЭ. Все типы задач. Разные способы решения - от Базового до Pro",
      id: "555",
      action: actions.handleCourseClick,
    },
    {
      title: "Чемпионат",
      text: "Хакатон  по программированию на скорость",
      id: "777",
      action: actions.showChampPage,
    },
  ];
  return (
    <Grid
      container
      spacing={2}
      columns={{ sm: 1, lg: 4 }}
      sx={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        height: "100%",
      }}
    >
      {coursesData.map((crs, id) => (
        <Grid
          size={{ sm: 1, md: 1 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          key={id}
        >
          <Card
            handleCourseClick={crs.action}
            title={crs.title}
            text={crs.text}
            id={crs.id}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default Courses;
