"use client";
import { useState, useEffect } from "react";
import {
  getDocFromCollectionByIdRealtimeClient,
  setDocInCollectionClient,
  updateUsersInChampClient,
  updateChampStatusClient,
  getDocDataFromCollectionByIdClient,
} from "@/db/domain/domain";

import { da } from "@/components/common/dialog/dialogMacro";

import user from "@/store/user";
import { generateString } from "@/globals/utils/utilsRandom";
import stn from "@/globals/settings";
import countdowncircle from "@/components/common/countdown/CountdownCircle/store";
import navigator from "@/components/Navigator/store/navigator";
import champ from "@/components/champ/store/champ";
import { getRandomTasksForChamp } from "@/components/champ/store/champVM";

const useChamps = () => {
  const [monitoringStarted, setMonitoringStarted] = useState(false);

  const disconnectChamp = () => {
    setMonitoringStarted(false);
  };

  useEffect(() => {
    user.changeNickName(user.name);
  }, []);

  useEffect(() => {
    if (!monitoringStarted) return;
    console.log("monitoringStarted", monitoringStarted);
    getDocFromCollectionByIdRealtimeClient(
      stn.collections.CHAMPS,
      champ.champid,
      (data) => {
        if (data.status == "started" && navigator.state.page == "champ") {
          if (data.users[user.userid].persstatus == "joined") {
            countdowncircle.show(() => {
              navigator.actions.openLessonStartPage({
                champid: champ.champid,
                nodemode: "champ",
              });
              updateUsersInChampClient(
                stn.collections.CHAMPS,
                {
                  id: user.userid,
                  name: user.nickname,
                  change: 0,
                  pts: 0,
                  persstatus: "champwip",
                },
                champ.champid
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
    const tasks = await getRandomTasksForChamp({
      levelStart: champ.range[0],
      levelEnd: champ.range[1],
      taskCount: champ.taskcount,
      courseid: "6b78800f-5f35-4fe1-a85b-dbc5e3ab71b0",
    });
    if (tasks.status == "error") {
      da.info.notenoughttasks(tasks.count);
    } else {
      const champid = generateString(7);
      champ.setChampId(champid);
      setDocInCollectionClient(
        stn.collections.CHAMPS,
        { tasks: tasks.data, users: [], status: "created" },
        champid
      );
    }
  };

  const joinChamp = async () => {
    try {
      const champData = await getDocDataFromCollectionByIdClient(
        stn.collections.CHAMPS,
        champ.champid
      );
      champData;
      if (
        !champData.data.users[user.userid]?.persstatus ||
        champData.data.users[user.userid].persstatus == "joined"
      ) {
        setMonitoringStarted(true);
        await updateUsersInChampClient(
          stn.collections.CHAMPS,
          {
            id: user.userid,
            name: user.nickname,
            change: 0,
            pts: 0,
            persstatus: "joined",
            avatarid: user.avatarid,
          },
          champ.champid
        );
      } else if (champData.data.users[user.userid].persstatus == "champwip") {
        da.info.champblocked();
      } else if (
        champData.data.users[user.userid].persstatus == "champisover"
      ) {
        da.info.champover();
      }
    } catch (e) {
      da.info.nochamp(e);
    }
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
    disconnectChamp,
  };
};

export default useChamps;
