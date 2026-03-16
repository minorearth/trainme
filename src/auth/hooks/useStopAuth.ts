//react stuff
import { useEffect } from "react";

//stores
import user from "@/auth/store/user";
import { getAuthTimestamp } from "@/db/localstorageDB";
import { signOut } from "@/auth/services/servicesAuth";
import { useRouter } from "next/navigation";
import S from "@/globals/settings";
//

const useStopAuth = () => {
  const router = useRouter();

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    const checkAuthTimeout = async () => {
      const timestamp = getAuthTimestamp();
      if (timestamp) {
        const currentTime = Date.now();
        const elapsed = currentTime - timestamp;
        if (elapsed >= S.SESSION_TIME_LIFE) {
          await signOut(router);
        }
      }
    };

    const initAuthTimer = () => {
      checkAuthTimeout();
      intervalId = setInterval(checkAuthTimeout, 10000);
    };

    initAuthTimer();

    return () => {
      clearInterval(intervalId);
    };
  }, [router]);
};

export default useStopAuth;
