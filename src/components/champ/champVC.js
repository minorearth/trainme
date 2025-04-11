"use client";
import { useState, useEffect } from "react";
import {
  getDocFromCollectionByIdRealtimeClient,
  updateDocFieldsInCollectionByIdClient,
  setDocInCollectionClient,
  updateUsersInChampClient,
  updateChampStatusClient,
  getDocDataFromCollectionByIdClient,
} from "@/db/domain/domain";

import { getCSP } from "@/db/localstorage";
import user from "@/store/user";
import { generateString } from "@/globals/utils/utilsRandom";
import stn from "@/globals/settings";
import alertdialog from "@/components/common/dialog/store";
import countdowncircle from "@/components/common/countdown/CountdownCircle/store";

const useChamps = ({ actionsNAV, appState }) => {
  const [monitoringStarted, setMonitoringStarted] = useState(false);
  const [champid, setChampid] = useState("");
  const [inputChampId, setInputChampd] = useState("");
  const [taskCount, setTaskCount] = useState(5);
  const [userName, setUserName] = useState("Какой-то");
  const [range, setRange] = useState([1, 30]);
  const [avatarid, setAvatarid] = useState(0);

  const changeRange = (event, newValue) => {
    setRange(newValue);
  };

  const disconnectChamp = () => {
    setMonitoringStarted(false);
  };

  const changeInputChampId = (e) => {
    setInputChampd(e.target.value);
    setChampid(e.target.value);
  };

  const changeTaskCount = (e) => {
    // e.target.value.match(/[^\d]/g) == null &&
    //   Number(e.target.value) != 0 &&
    //   setTaskCount(e.target.value);

    // e.target.value == "" && setTaskCount(e.target.value);
    /^\d{0,2}$/.test(e.target.value) && setTaskCount(e.target.value);
  };

  const changeUserName = (e) => {
    /^[А-яA-Za-z][А-яA-Za-z0-9 ]{0,25}$/.test(e.target.value) &&
      setUserName(e.target.value);

    // if (e.target.value) {
    //   const a = e.target.value.match(/[А-яA-Za-z]+[А-яA-Za-z ]*/g);
    //   a && setUserName(a[0]);
    // } else setUserName("");
  };

  useEffect(() => {
    // appState.champid && setInputChampd(appState.champid);
    appState.champid && setChampid(appState.champid);
    setUserName(user.name);
  }, []);

  useEffect(() => {
    console.log("monitoringStarted", monitoringStarted);
    if (!monitoringStarted) return;
    getDocFromCollectionByIdRealtimeClient(
      stn.collections.CHAMPS,
      champid,
      (data) => {
        const CSP = getCSP();
        if (data.status == "started" && CSP.page == "champ") {
          // if (!data.users[user.userid]?.persstatus) {
          //   return;
          // }
          if (data.users[user.userid].persstatus == "joined") {
            countdowncircle.show(() => {
              actionsNAV.runChamp(champid);
              updateUsersInChampClient(
                stn.collections.CHAMPS,
                {
                  id: user.userid,
                  name: userName,
                  change: 0,
                  pts: 0,
                  persstatus: "champwip",
                },
                champid
              );
              setMonitoringStarted(false);
            });
          }
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
  }, [monitoringStarted]);

  const createChamp = async () => {
    const tasks = await actionsNAV.getRandomTasksForChamp({
      levelStart: range[0],
      levelEnd: range[1],
      taskCount,
    });
    const champid = generateString(7);
    setChampid(champid);
    setDocInCollectionClient(
      stn.collections.CHAMPS,
      { tasks, users: [], status: "created" },
      champid
    );
  };

  const joinChamp = async () => {
    try {
      const champData = await getDocDataFromCollectionByIdClient(
        stn.collections.CHAMPS,
        champid
      );
      champData;
      if (
        !champData.data.users[user.userid]?.persstatus ||
        champData.data.users[user.userid].persstatus == "joined"
      ) {
        setMonitoringStarted(true);
        const res = await updateUsersInChampClient(
          stn.collections.CHAMPS,
          {
            id: user.userid,
            name: userName,
            change: 0,
            pts: 0,
            persstatus: "joined",
            avatarid,
          },
          champid
        );
      } else if (champData.data.users[user.userid].persstatus == "champwip") {
        alertdialog.showDialog(
          "Ошибка",
          "Ты вышел из чемпионата, обратно уже не зайти..",
          1,
          () => {}
        );
      } else if (
        champData.data.users[user.userid].persstatus == "champisover"
      ) {
        alertdialog.showDialog(
          "Ошибка",
          "Ты уже поучаствовал в этом чемпионате",
          1,
          () => {}
        );
      }
    } catch (e) {
      console.log(e);
      alertdialog.showDialog(
        "Нет такого чемпионата",
        "Перепроверьте все еще раз",
        1,
        () => {}
      );
    }
    // console.log("champData", champData);
    // const res = await updateUsersInChampClient(
    //   stn.collections.CHAMPS,
    //   {
    //     id: user.userid,
    //     name: userName,
    //     change: 0,
    //     pts: 0,
    //     persstatus: "joined",
    //   },
    //   champid
    // );
    // if (res == "error") {
    //   // alertdialog.showDialog(
    //   //   "Нет такого чемпионата",
    //   //   "Перепроверьте все еще раз",
    //   //   1,
    //   //   () => {}
    //   // );
    // } else setMonitoringStarted((state) => !state);
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
    inputChampId,
    changeInputChampId,
    changeRange,
    range,
    changeTaskCount,
    taskCount,
    disconnectChamp,
    avatarid,
    setAvatarid,
    setChampid,
  };
};

export default useChamps;
