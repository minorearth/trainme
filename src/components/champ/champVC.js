"use client";
import { useState, useEffect } from "react";
import {
  getDocFromCollectionByIdRealtimeClient,
  updateDocFieldsInCollectionByIdClient,
  setDocInCollectionClient,
  updateUsersInChampClient,
  updateChampStatusClient,
} from "@/db/domain/domain";

import {
  persistState,
  loadStatePersisted,
  updateStateLS,
} from "@/db/localstorage";

import user from "@/store/user";

import { ObjtoArr } from "@/globals/utils/objectUtils";
// import survey from "@/store/survey";
import stn from "@/globals/settings";
const champid = "12345";

const useChamps = ({ actions, appState }) => {
  const { getRandomTasksForChamp, setTestsStartedPage } = actions;

  const [rows, setRowsx] = useState([]);
  const [connected, setConnected] = useState(false);
  const [chapmid, setChapmid] = useState("12345");
  const [userName, setUserName] = useState("Пупкин");

  const changeChampid = (e) => {
    setChapmid(e.target.value);
  };

  const changeUserName = (e) => {
    setUserName(e.target.value);
  };

  useEffect(() => {
    if (!connected) return;
    // if (!survey.showSurvey) return;
    getDocFromCollectionByIdRealtimeClient(
      stn.collections.CHAMPS,
      chapmid,
      (data) => {
        setRowsx(ObjtoArr(data.users));
        const statePersisted = loadStatePersisted();
        if (data.status == "started" && statePersisted.page == "champ") {
          runChamp(chapmid);
        }
      }
    ).then((docData) => {
      setInterval(() => {
        docData.unsubscribe();
      }, 1000 * 60 * 30);

      setRowsx(ObjtoArr(docData?.data?.users));
    });
    return () => {
      console.log("grid unmounted");
    };
    // }, [surveyid, survey.showSurvey]);
  }, [connected]);

  const createChamp = async () => {
    const tasks = await getRandomTasksForChamp({
      levelStart: 20,
      levelEnd: 30,
    });
    actions.changeState({
      creator: champid,
    });

    setDocInCollectionClient(
      stn.collections.CHAMPS,
      { tasks, users: [], status: "created" },
      champid
    );
  };

  const joinChamp = async (chapmid) => {
    await updateUsersInChampClient(
      stn.collections.CHAMPS,
      { id: user.userid, name: userName },
      chapmid
    );
    setConnected(true);
  };

  const startChamp = async (chapmid) => {
    updateChampStatusClient(stn.collections.CHAMPS, "started", chapmid);
  };

  const runChamp = async (chapmid) => {
    console.log("run");
    setTestsStartedPage({
      chapter: chapmid,
      repeat: false,
      // overflow,
      // remainsum,
      courseid: chapmid,
      nodemode: "champ",
      textbook: false,
      champ: true,
      // level,
    });
  };

  return {
    rows,
    setRowsx,
    createChamp,
    joinChamp,
    changeChampid,
    startChamp,
    chapmid,
    changeUserName,
    userName,
  };
};

export default useChamps;
