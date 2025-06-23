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

export const createChamp = async () => {
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
    champ.setChampIdP(champid);
    setDocInCollectionClient(
      stn.collections.CHAMPS,
      { tasks, users: [], status: "created" },
      champid
    );
  }
};

export const joinChamp = async () => {
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
      champ.setMonitoringStarted(true);
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
    } else if (champData.data.users[user.userid].persstatus == "champisover") {
      da.info.champover();
    }
  } catch (e) {
    da.info.nochamp(e);
  }
};

export const startChamp = async (champid) => {
  window.open(
    `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${champid}`,
    "_blank"
  );
  updateChampStatusClient(stn.collections.CHAMPS, "started", champid);
};
