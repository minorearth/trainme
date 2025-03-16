"use client";
import { useState, useEffect } from "react";
import { getDocFromCollectionByIdRealtimeClient } from "@/db/domain/domain";

import { ObjtoArr } from "@/globals/utils/objectUtils";
import stn from "@/globals/settings";
import useColumns from "./useColumns";

const useDashboard = ({ chapmid }) => {
  const [rows, setRowsx] = useState([]);

  useEffect(() => {
    if (!chapmid) return;
    getDocFromCollectionByIdRealtimeClient(
      stn.collections.CHAMPS,
      chapmid,
      (data) => {
        setRowsx(ObjtoArr(data?.users));
      }
    ).then((docData) => {
      setInterval(() => {
        docData.unsubscribe();
      }, 1000 * 60 * 30);
      setRowsx(ObjtoArr(docData?.data?.users));
    });
    return () => {
      console.log("grid unmounted");
    };
    // }, [surveyid, survey.showSurvey]);
  }, [chapmid]);

  return {
    rows,
    setRowsx,
  };
};

export default useDashboard;
