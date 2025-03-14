"use client";
import { useState, useEffect } from "react";
import {
  getDocFromCollectionByIdRealtimeClient,
  updateDocFieldsInCollectionByIdClient,
} from "@/db/domain/domain";
import {
  setDocInCollectionClient,
  updateUsersInChampClient,
} from "@/db/domain/domain";
import user from "@/store/user";

import { ObjtoArr } from "@/globals/utils/objectUtils";
// import survey from "@/store/survey";
import stn from "@/globals/settings";
const champid = "12345";

const useChamps = ({ surveyid }) => {
  const [rows, setRowsx] = useState([]);
  const [connected, setConnected] = useState(false);
  const [chapmid, setChapmid] = useState("12345");

  const changeChampid = (e) => {
    setChapmid(e.target.value);
  };

  useEffect(() => {
    if (!connected) return;
    // if (!survey.showSurvey) return;
    console.log("nene");
    getDocFromCollectionByIdRealtimeClient(
      stn.collections.CHAMPS,
      chapmid,
      (data) => {
        setRowsx(data.users);
      }
    ).then((docData) => {
      setInterval(() => {
        docData.unsubscribe();
      }, 1000 * 60 * 30);
      setRowsx(docData?.data?.users);
    });
    return () => {
      console.log("grid unmounted");
    };
    // }, [surveyid, survey.showSurvey]);
  }, [connected]);

  const createChamp = () => {
    setDocInCollectionClient(
      stn.collections.CHAMPS,
      { tests: [], users: [] },
      champid
    );
  };

  const joinChamp = async (chapmid) => {
    await updateUsersInChampClient(
      stn.collections.CHAMPS,
      { id: user.userid, name: user.userid },
      chapmid
    );
    setConnected(true);
  };

  return { rows, setRowsx, createChamp, joinChamp, changeChampid, chapmid };
};

export default useChamps;
