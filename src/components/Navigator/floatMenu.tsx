import FabAnimated from "@/components/common/fabAnimated/fabAnimated";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";

//globals
import S from "@/globals/settings";

//stores
import navigator from "./layers/store/navigator";
import { PG } from "@/tpconst/src/const";
import { L } from "@/tpconst/src/lang";
const RIGHT = 16;
const TOP = 16;

const FloatMenu = () => {
  const router = useRouter();
  return (
    <Box
      id="human"
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 1000,
      }}
      component={motion.div}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 5,
        ease: "easeInOut",
        // times: [0, 0.2, 0.5, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 0,
      }}
    >
      <FabAnimated
        tooltip={L.ru.TT.EXIT}
        icon="close"
        action={() => {
          navigator.actions.openLoginPageSignOut(router);
        }}
        style={{ top: TOP, right: RIGHT }}
      />

      {navigator.state.page == PG.champ && (
        <FabAnimated
          tooltip={L.ru.TT.GOMAINPAGE}
          icon="home"
          action={() => navigator.actions.openAllCoursePage()}
          style={{ top: TOP, right: RIGHT + S.ui.FLOAT_BTN_PADDING }}
        />
      )}
    </Box>
  );
};

export default FloatMenu;
