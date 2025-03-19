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
  const { getRandomTasksForChamp, openTestsStartedPage, runChamp } = actions;
  const [connected, setConnected] = useState(false);
  const [champid, setChampid] = useState("");
  const [champNumber, setChampNumber] = useState("");
  const [userName, setUserName] = useState("Какой-то");
  const [range, setRange] = useState([1, 30]);

  const changeRange = (event, newValue) => {
    setRange(newValue);
  };

  const changeChampNumber = (e) => {
    setChampNumber(e.target.value);
  };

  const changeUserName = (e) => {
    setUserName(e.target.value);
  };

  useEffect(() => {
    if (!connected) return;
    getDocFromCollectionByIdRealtimeClient(
      stn.collections.CHAMPS,
      champNumber,
      (data) => {
        const statePersisted = loadStatePersisted();
        if (data.status == "started" && statePersisted.page == "champ") {
          runChamp(champNumber);
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
    setChampid(champid);
    setChampNumber(champid);
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
      champNumber
    );
    setConnected((state) => !state);
  };

  const startChamp = async (champid) => {
    updateChampStatusClient(stn.collections.CHAMPS, "started", champid);
  };

  return {
    createChamp,
    joinChamp,
    startChamp,
    champid,
    changeUserName,
    userName,
    champNumber,
    changeChampNumber,
    changeRange,
    range,
  };
};

export default useChamps;
