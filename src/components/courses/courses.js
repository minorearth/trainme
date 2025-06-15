"use client";
import Grid from "@mui/material/Grid2";
import Card from "./course";
import { courses } from "@/globals/courses";

const Courses = () => {
  const coursesData = Object.keys(courses)
    .map((id) => ({
      ...courses[id],
    }))
    .sort((a, b) => a.order - b.order);

  return (
    <>
      <Grid
        container
        spacing={2}
        columns={{ sm: 1, md: 2, lg: 4 }}
        sx={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
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
              onClick={crs.coursesAction}
              title={crs.title}
              text={crs.text}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Courses;
