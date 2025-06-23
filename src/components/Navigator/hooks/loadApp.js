//react stuff
import { useEffect, useState } from "react";

//utils and constants
import { startListeners, stopListeners } from "@/globals/listeners/listeners";
import { loadPTrek } from "@/components/Navigator/layers/services/loadApp";

//stores
import user from "@/userlayers/store/user";
//

const useApp = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startListeners();
    loadPTrek();
    setLoading(false);
    return () => {
      stopListeners();
    };
  }, [user]);

  return {
    loading,
  };
};

export default useApp;
