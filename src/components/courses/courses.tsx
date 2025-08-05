"use client";
import Grid from "@mui/material/Grid2";
import Card from "./courseCard";
import { getCoursesSorted } from "@/db/localRepository/repositoryLocalFiles";
import { CoursesDB } from "tpconst/T";

import splash from "@/components/common/splash/store";

const Courses = () => {
  const coursesData: CoursesDB[] = getCoursesSorted();

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
              courseid={crs.courseid}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Courses;
