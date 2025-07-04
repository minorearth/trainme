//react stuff
import { useEffect, useState } from "react";

//utils and constants
import { startListeners, stopListeners } from "@/globals/listeners/listeners";
import { loadPTrek } from "@/components/Navigator/layers/services/loadApp";

//stores
import user from "@/userlayers/store/user";
import navigator from "../layers/store/navigator";
//

const useApp = () => {
  useEffect(() => {
    const startApp = async () => {
      startListeners();
      await loadPTrek();
      navigator.setDataloaded(true);
    };
    startApp();

    return () => {
      stopListeners();
    };
  }, [user]);
};

export default useApp;
