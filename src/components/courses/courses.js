"use client";
import Grid from "@mui/material/Grid2";
import Card from "./course";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import { Box } from "@mui/material";
import LogoutBtn from "./LogoutBtn";
import { courses } from "@/globals/courses";

const Courses = ({ actionsNAV }) => {
  const coursesData = Object.keys(courses)
    .map((id) => ({
      title: courses[id].title,
      text: courses[id].text,
      id: id,
      order: courses[id].order,
      action:
        courses[id].type == "course"
          ? actionsNAV.openCourseFlowPageFromMain
          : actionsNAV.openChampPage,
    }))
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {/* <Box sx={{ position: "absolute", right: "10px", top: "10px" }}>
        <DLSwitch />
      </Box> */}
      {/* <Box sx={{ position: "absolute", right: "20px", top: "20px" }}>
        <LogoutBtn />
      </Box> */}
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
              openCourseFlowPageFromMain={crs.action}
              title={crs.title}
              text={crs.text}
              id={crs.id}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Courses;
