//react stuff
import { useEffect } from "react";

//services
import { startListeners, stopListeners } from "@/globals/listeners/listeners";
import { loadPTrek } from "@/components/Navigator/layers/services/loadApp";

//stores
import user from "@/userlayers/store/user";
import navigator from "@/components/Navigator/layers/store/navigator";
//

const useApp = () => {
  useEffect(() => {
    const startApp = async () => {
      startListeners();
      await loadPTrek();
      navigator.setDataloaded();
    };
    startApp();

    return () => {
      stopListeners();
    };
  }, [user]);
};

export default useApp;
