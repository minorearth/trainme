//react stuff
import { useEffect } from "react";

//services
import { startListeners, stopListeners } from "@/globals/listeners/listeners";
import { loadPyTrek } from "@/components/Navigator/layers/services/loadApp";

//stores
import user from "@/auth/store/user";
import navigator from "@/components/Navigator/layers/store/navigator";
import splash from "@/components/common/splash/store";
//

const useApp = () => {
  useEffect(() => {
    !splash.shown && splash.showProgress(false, "progressdots", 4000);

    const startApp = async () => {
      startListeners();
      await loadPyTrek();
      navigator.setDataloaded();
      splash.closeProgress();
    };
    startApp();

    return () => {
      stopListeners();
    };
  }, [user]);
};

export default useApp;
