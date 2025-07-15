import { useState, useEffect } from "react";
import champ from "@/components/champ/layers/store/champ";

const useDashboard = ({ champid }: { champid: string }) => {
  useEffect(() => {
    champ.actions.captureUsersJoined({ champid });
  }, []);
};

export default useDashboard;
