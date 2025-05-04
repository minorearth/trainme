"use client";
import { useState, useEffect } from "react";
import {
  updateDocFieldsInCollectionByIdClient,
  setDocInCollectionClient,
  updateUsersInChampClient,
  updateChampStatusClient,
  getDocDataFromCollectionByIdClient,
} from "@/db/domain/domain";

import user from "@/store/user";
import stn from "@/globals/settings";
import alertdialog from "@/components/common/dialog/store";

const useJoinGroup = ({ groupid, manager }) => {
  const [secondName, setFirstName] = useState("Кто-то");
  const [firstName, setSecondName] = useState("Где-то");

  const changeFirstName = (e) => {
    /^[А-яA-Za-z][А-яA-Za-z0-9 ]{0,25}$/.test(e.target.value) &&
      setFirstName(e.target.value);
  };

  const changeSecondName = (e) => {
    /^[А-яA-Za-z][А-яA-Za-z0-9 ]{0,25}$/.test(e.target.value) &&
      setFirstName(e.target.value);
  };

  // useEffect(() => {
  //   setUserName(user.name);
  // }, []);

  const joinGroup = async () => {
    console.log(groupid, manager);
    // try {
    //   const champData = await getDocDataFromCollectionByIdClient(
    //     stn.collections.CHAMPS,
    //     champid
    //   );
    //   updateChampStatusClient(stn.collections.CHAMPS, "started", champid);
    // } catch (e) {
    //   alertdialog.showDialog(
    //     "Нет такого чемпионата",
    //     "Перепроверьте все еще раз",
    //     1,
    //     () => {}
    //   );
    // }
  };

  return {
    joinGroup,
    changeFirstName,
    changeSecondName,
    firstName,
    secondName,
  };
};

export default useJoinGroup;
