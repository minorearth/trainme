//react stuff
import { useEffect } from "react";

//services
import { startListeners, stopListeners } from "@/globals/listeners/listeners";
import { loadPyTrek } from "@/components/Navigator/layers/services/loadApp";

//stores
import navigator from "@/components/Navigator/layers/store/navigator";
import splash from "@/components/common/splash/store";
import { useRouter } from "next/navigation";
import useStopAuth from "@/auth/hooks/useStopAuth";
import unit from "@/components/unitrun/layers/store/unit";

//

const useApp = () => {
  const router = useRouter();
  useStopAuth();
  useEffect(() => {
    splash.showProgress(false, "progressdots", 4000);

    const startApp = async () => {
      startListeners();
      await loadPyTrek();
      navigator.setDataloaded();
      splash.closeProgress();
    };
    startApp();

    return () => {
      stopListeners();
      console.log("reset");
      unit.resetState();
    };
  }, []);
};

export default useApp;
