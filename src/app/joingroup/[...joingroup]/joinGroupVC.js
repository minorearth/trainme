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
  const [secondNameChecked, setSecondNameChecked] = useState(false);
  const [firstNameChecked, setFirstNameChecked] = useState(false);

  const changeFirstName = (e) => {
    /^[А-ЯA-Z][А-яA-Za-z]{0,25}$/.test(e.target.value)
      ? setFirstNameChecked(true)
      : setFirstNameChecked(false);

    setFirstName(e.target.value);
  };

  const changeSecondName = (e) => {
    /^[А-ЯA-Z][а-яA-Z]{0,25}$/.test(e.target.value)
      ? setSecondNameChecked(true)
      : setSecondNameChecked(false);

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
    firstNameChecked,
    secondNameChecked,
  };
};

export default useJoinGroup;
