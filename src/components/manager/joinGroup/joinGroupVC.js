"use client";
import { useState } from "react";
import { updateUserInGroupClient } from "@/db/domain/domain";

import user from "@/store/user";

const useJoinGroup = ({ groupid, manager }) => {
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [secondNameChecked, setSecondNameChecked] = useState(false);
  const [firstNameChecked, setFirstNameChecked] = useState(false);
  const [inviteAccepted, setInviteAccepted] = useState(false);

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

  const joinGroup = async () => {
    console.log("user", user.userid);
    try {
      await updateUserInGroupClient(
        "groups",
        { groupid, secondName, firstName, uid: user.userid },
        manager
      );
      setInviteAccepted(true);
    } catch (e) {}
  };

  return {
    joinGroup,
    changeFirstName,
    changeSecondName,
    firstName,
    secondName,
    firstNameChecked,
    secondNameChecked,
    inviteAccepted,
  };
};

export default useJoinGroup;
