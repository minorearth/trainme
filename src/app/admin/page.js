"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";

// import stn from "@/globals/settings";
import TextField from "@mui/material/TextField";
import {
  chapterFlowNodes,
  chapterFlowEdges,
} from "@/app/admin/adminUtils/chaptersFlowData";
import { testsall } from "@/app/admin/adminUtils/tasksData";
import { setDocInCollectionClient } from "@/db/domain/domain";

export default function Admin() {
  // const migrate = () => {
  //   setAllIndexedClient(false);
  // };

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        sx={{ fontSize: 20 }}
        onClick={() => {
          // setDocInCollectionClient(
          //   "chapters",
          //   { chapterFlowNodes, chapterFlowEdges },
          //   "lpN57HSZBLZCnP2j9l9L"
          // );

          const chapters = chapterFlowNodes.map((chapter) => chapter.id);
          chapters.forEach((chapterid) => {
            const tasks = testsall.filter(
              (test) => test.chapterid == chapterid
            );
            setDocInCollectionClient("tasks", { tasks }, chapterid);
            // console.log("taskofchapter", tasks);
          });
        }}
      >
        Залить в БД
      </Button>

      {/* <Box sx={{ display: "flex", flexDirection: "row" }}>
        <TextField
          id="usertodelete"
          label="Пользователь"
          defaultValue="3a5nHnKXJFTMM0eCooHqKefECTj1"
          sx={{ margin: "4px" }}
          fullWidth
          InputProps={{ sx: { borderRadius: 5 } }}
        />
      </Box>
      <TextField
        id="surveytodelete"
        label="Опрос"
        defaultValue=""
        sx={{ margin: "4px" }}
        fullWidth
        InputProps={{ sx: { borderRadius: 5 } }}
      />
      <TextField
        id="file"
        label="Файл"
        defaultValue=""
        sx={{ margin: "4px" }}
        fullWidth
        InputProps={{ sx: { borderRadius: 5 } }}
      />
      <TextField
        id="IncIndex"
        label="Увеличить индекс"
        defaultValue="100"
        sx={{ margin: "4px" }}
        fullWidth
        InputProps={{ sx: { borderRadius: 5 } }}
      />

      <Button sx={{ fontSize: 20 }} onClick={() => removeSurveyASAP()}>
        Удалить опрос
      </Button>
      <Button sx={{ fontSize: 20 }} onClick={() => removeFileFromSurveyASAP()}>
        Удалить файл
      </Button>
      <Button sx={{ fontSize: 20 }} onClick={() => incIndex()}>
        Увеличить индекс(тестирвоание)
      </Button>

      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <TextField
          id="index"
          label="Старый индекс"
          defaultValue=""
          sx={{ margin: "4px" }}
          fullWidth
          InputProps={{ sx: { borderRadius: 5 } }}
        />
        <TextField
          id="newIndex"
          label="Новый индекс"
          defaultValue="100"
          sx={{ margin: "4px" }}
          fullWidth
          InputProps={{ sx: { borderRadius: 5 } }}
        />
        <Button sx={{ fontSize: 20 }} onClick={() => сopyIndexASAP()}>
          Копировать
        </Button>
      </Box>
      <Button sx={{ fontSize: 20 }} onClick={() => backup()}>
        Бэкап
      </Button> */}
    </Box>
  );
}
