"use client";
import { useState, useEffect } from "react";
import {
  getDocFromCollectionByIdRealtimeClient,
  updateDocFieldsInCollectionByIdClient,
  setDocInCollectionClient,
  updateUsersInChampClient,
  updateChampStatusClient,
} from "@/db/domain/domain";

import { getCSP } from "@/db/localstorage";
import user from "@/store/user";
import { generateString } from "@/globals/utils/utilsRandom";
import stn from "@/globals/settings";
import alertdialog from "@/store/dialog";

const useChamps = ({ actionsNAV, appState }) => {
  const { getRandomTasksForChamp, runChamp } = actionsNAV;
  const [connected, setConnected] = useState(false);
  const [champid, setChampid] = useState("");
  const [champNumber, setChampNumber] = useState("");
  const [taskCount, setTaskCount] = useState(5);
  const [userName, setUserName] = useState("Какой-то");
  const [range, setRange] = useState([1, 30]);

  const changeRange = (event, newValue) => {
    setRange(newValue);
  };

  const changeChampNumber = (e) => {
    setChampNumber(e.target.value);
  };

  const changeTaskCount = (e) => {
    e.target.value.match(/[^\d]/g) == null &&
      Number(e.target.value) != 0 &&
      setTaskCount(e.target.value);

    e.target.value == "" && setTaskCount(e.target.value);
  };

  const changeUserName = (e) => {
    if (e.target.value) {
      const a = e.target.value.match(/[А-яA-Za-z]+[А-яA-Za-z ]*/g);
      a && setUserName(a[0]);
    } else setUserName("");
  };

  useEffect(() => {
    appState.champid && setChampNumber(appState.champid);
    appState.champid && setChampid(appState.champid);
    setUserName(user.name);
  }, []);

  useEffect(() => {
    if (!connected) return;
    getDocFromCollectionByIdRealtimeClient(
      stn.collections.CHAMPS,
      champNumber,
      (data) => {
        const CSP = getCSP();
        if (data.status == "started" && CSP.page == "champ") {
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
      taskCount,
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
    const res = await updateUsersInChampClient(
      stn.collections.CHAMPS,
      { id: user.userid, name: userName, change: 0, pts: 0 },
      champNumber
    );
    if (res == "error") {
      alertdialog.showDialog(
        "Нет такого чемпионата",
        "Перепроверьте все еще раз",
        1,
        () => {}
      );
    } else setConnected((state) => !state);
  };

  const startChamp = async (champid) => {
    window.open(
      `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${champid}`,
      "_blank"
    );
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
    changeTaskCount,
    taskCount,
  };
};

export default useChamps;
