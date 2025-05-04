"use client";
import { useState, useEffect } from "react";
import {
  updateDocFieldsInCollectionByIdClient,
  setDocInCollectionClient,
  updateUsersInChampClient,
  updateChampStatusClient,
  getDocDataFromCollectionByIdClient,
  updateUserInGroupClient,
} from "@/db/domain/domain";

import user from "@/store/user";
import stn from "@/globals/settings";
import alertdialog from "@/components/common/dialog/store";

const useJoinGroup = ({ groupid, manager }) => {
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");

  const changeFirstName = (e) => {
    /^[А-яA-Za-z][А-яA-Za-z0-9 ]{0,25}$/.test(e.target.value) &&
      setFirstName(e.target.value);
  };

  const changeSecondName = (e) => {
    /^[А-ЯA-Z][а-яA-Z]{0,25}$/.test(e.target.value) &&
      setSecondName(e.target.value);
  };

  // useEffect(() => {
  //   setUserName(user.name);
  // }, []);

  const joinGroup = async () => {
    try {
      await updateUserInGroupClient(
        "groups",
        { groupid, secondName, firstName, uid: user.userid },
        manager
      );
      // updateChampStatusClient(stn.collections.CHAMPS, "started", champid);
    } catch (e) {
      alertdialog.showDialog(
        "Нет такого чемпионата",
        "Перепроверьте все еще раз",
        1,
        () => {}
      );
    }
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
