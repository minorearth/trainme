"use client";
import { useState } from "react";

//services
import { addUserToGroup } from "@/components/manager/groupsNreports/groups/layers/repository/repository";

import user from "@/userlayers/store/user";

const useJoinGroup = () => {
  const [inviteAccepted, setInviteAccepted] = useState(false);

  const joinGroup = async ({
    groupid,
    secondName,
    firstName,
    manager,
  }: {
    groupid: string;
    secondName: string;
    firstName: string;
    manager: string;
  }) => {
    try {
      await addUserToGroup({
        groupid,
        secondName,
        firstName,
        manager,
        uid: user.userid,
      });
      setInviteAccepted(true);
    } catch (e) {}
  };

  return {
    joinGroup,
    inviteAccepted,
  };
};

export default useJoinGroup;
