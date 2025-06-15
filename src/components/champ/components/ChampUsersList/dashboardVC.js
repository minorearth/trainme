"use client";
import { useState, useEffect } from "react";
import { getDocFromCollectionByIdRealtimeClient } from "@/db/domain/domain";

import { ObjtoArr } from "@/globals/utils/objectUtils";
import stn from "@/globals/settings";

const useDashboard = ({ champid }) => {
  const [rows, setRowsx] = useState([]);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!champid) return;
    getDocFromCollectionByIdRealtimeClient(
      stn.collections.CHAMPS,
      champid,
      (data) => {
        setRowsx(ObjtoArr(data?.users));
        setStarted(data?.status == "started" ? true : false);
      }
    ).then((docData) => {
      setInterval(() => {
        docData.unsubscribe();
      }, 1000 * 60 * 30);
      setRowsx(ObjtoArr(docData?.data?.users));
      setStarted(docData?.data?.status == "started" ? true : false);
    });
    return () => {
      console.log("grid unmounted");
    };
    // }, [surveyid, survey.showSurvey]);
  }, [champid]);

  return {
    rows,
    setRowsx,
    started,
  };
};

export default useDashboard;
