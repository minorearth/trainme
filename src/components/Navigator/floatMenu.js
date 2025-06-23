import FabAnimated from "@/components/common/fabAnimated/fabAnimated";
import stn from "@/globals/settings";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import navigator from "./layers/store/navigator";
import { useRouter } from "next/navigation";

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
        tooltip={"Выйти"}
        icon="close"
        action={() => {
          navigator.actions.openLoginPageSignOut();
          router.push(`/login/`);
        }}
        position={{ top: TOP, right: RIGHT }}
      />

      {navigator.state.page == "champ" && (
        <FabAnimated
          tooltip={"На главную"}
          icon="home"
          action={() => navigator.actions.openAllCoursePage()}
          position={{ top: TOP, right: RIGHT + stn.ui.FLOAT_BTN_PADDING }}
        />
      )}
    </Box>
  );
};

export default FloatMenu;
