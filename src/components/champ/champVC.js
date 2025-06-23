"use client";
import { useState, useEffect } from "react";
import {
  getDocFromCollectionByIdRealtimeClient,
  setDocInCollectionClient,
  updateUsersInChampClient,
  updateChampStatusClient,
  getDocDataFromCollectionByIdClient,
} from "@/db/domain/domain";

import { getRandomTasksForChamp } from "@/components/taskset/layers/repository/repository";

import { da } from "@/components/common/dialog/dialogMacro";

import { generateString } from "@/globals/utils/utilsRandom";
import stn from "@/globals/settings";
import user from "@/userlayers/store/user";
import countdowncircle from "@/components/common/countdown/CountdownCircle/store";
import navigator from "@/components/Navigator/layers/store/navigator";
import champ from "@/components/champ/layers/store/champ";

const useChamps = () => {
  useEffect(() => {
    // user.changeNickName(user.username);
  }, []);

  useEffect(() => {
    return reaction(
      () => champ.monitoringStarted,
      () => {
        console.log("champ.monitoringStarted", champ.monitoringStarted);
        if (!champ.monitoringStarted) return;
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
                  champ.setMonitoringStarted(false);
                });
              }
            }
          }
        ).then((docData) => {
          setInterval(() => {
            docData.unsubscribe();
          }, 1000 * 60 * 30);
        });
      }
    );
  }, []);
};

export default useChamps;
