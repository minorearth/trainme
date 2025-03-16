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
import { generateString } from "@/globals/utils/utilsRandom";
import { ObjtoArr } from "@/globals/utils/objectUtils";
import stn from "@/globals/settings";

const useChamps = ({ actions, appState }) => {
  const { getRandomTasksForChamp, setTestsStartedPage } = actions;
  const [connected, setConnected] = useState(false);
  const [chapmid, setChapmid] = useState("");
  const [chapmNumber, setChapmNumber] = useState("");

  const [userName, setUserName] = useState("Какой-то");

  const [range, setRange] = useState([1, 30]);

  const changeRange = (event, newValue) => {
    setRange(newValue);
  };

  // const changeChampid = (e) => {
  //   setChapmid(e.target.value);
  // };

  const changeChampNumber = (e) => {
    setChapmNumber(e.target.value);
  };

  const changeUserName = (e) => {
    setUserName(e.target.value);
  };

  useEffect(() => {
    if (!connected) return;
    console.log("chapmid", chapmNumber);
    getDocFromCollectionByIdRealtimeClient(
      stn.collections.CHAMPS,
      chapmNumber,
      (data) => {
        const statePersisted = loadStatePersisted();
        console.log("data", data);
        if (data.status == "started" && statePersisted.page == "champ") {
          runChamp(chapmNumber);
        }
      }
    ).then((docData) => {
      setInterval(() => {
        docData.unsubscribe();
      }, 1000 * 60 * 30);
    });
    return () => {
      console.log("grid unmounted");
    };
    // }, [surveyid, survey.showSurvey]);
  }, [connected]);

  const createChamp = async () => {
    const tasks = await getRandomTasksForChamp({
      levelStart: range[0],
      levelEnd: range[1],
    });
    const champid = generateString(7);
    // actions.changeState({
    //   creator: champid,
    // });
    setChapmid(champid);
    setChapmNumber(champid);

    setDocInCollectionClient(
      stn.collections.CHAMPS,
      { tasks, users: [], status: "created" },
      champid
    );
  };

  const joinChamp = async () => {
    console.log("chapmNumber", chapmNumber);
    await updateUsersInChampClient(
      stn.collections.CHAMPS,
      { id: user.userid, name: userName },
      chapmNumber
    );
    setConnected((state) => !state);
  };

  const startChamp = async (chapmid) => {
    updateChampStatusClient(stn.collections.CHAMPS, "started", chapmid);
  };

  const runChamp = async (chapmid) => {
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
    createChamp,
    joinChamp,
    // changeChampid,
    startChamp,
    chapmid,
    changeUserName,
    userName,
    chapmNumber,
    changeChampNumber,
    changeRange,
    range,
  };
};

export default useChamps;
