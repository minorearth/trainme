import { useState, useEffect } from "react";
import champ from "@/components/champ/layers/store/champ";

const useDashboard = () => {
  useEffect(() => {
    champ.actions.captureUsersJoined();
  }, []);

  return {};
};

export default useDashboard;
