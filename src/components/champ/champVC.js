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
import stn from "@/globals/settings";

const useChamps = ({ actions, appState }) => {
  const { getRandomTasksForChamp, setTestsStartedPage, runChamp } = actions;
  const [connected, setConnected] = useState(false);
  const [chapmid, setChapmid] = useState("");
  const [chapmNumber, setChapmNumber] = useState("");
  const [userName, setUserName] = useState("Какой-то");
  const [range, setRange] = useState([1, 30]);

  const changeRange = (event, newValue) => {
    setRange(newValue);
  };

  const changeChampNumber = (e) => {
    setChapmNumber(e.target.value);
  };

  const changeUserName = (e) => {
    setUserName(e.target.value);
  };

  useEffect(() => {
    if (!connected) return;
    getDocFromCollectionByIdRealtimeClient(
      stn.collections.CHAMPS,
      chapmNumber,
      (data) => {
        const statePersisted = loadStatePersisted();
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
  }, [connected]);

  const createChamp = async () => {
    const tasks = await getRandomTasksForChamp({
      levelStart: range[0],
      levelEnd: range[1],
    });
    const champid = generateString(7);
    setChapmid(champid);
    setChapmNumber(champid);
    setDocInCollectionClient(
      stn.collections.CHAMPS,
      { tasks, users: [], status: "created" },
      champid
    );
  };

  const joinChamp = async () => {
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

  return {
    createChamp,
    joinChamp,
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
