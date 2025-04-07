import FabAnimated from "@/components/common/fabAnimated/fabAnimated";

import stn from "@/globals/settings";
import local from "@/globals/local";

const LEFT = 16;
const RIGHT = 16;
const TOP = 16;
const BOTTOM = 16;

const FloatMenu = ({ page, actionsNAV }) => {
  return (
    <>
      <FabAnimated
        tooltip={"Выйти"}
        icon="close"
        action={async () => await actionsNAV.openLoginPageSignOut()}
        position={{ top: TOP, right: RIGHT }}
      />
      <FabAnimated
        tooltip={"Поддержка"}
        icon="support"
        action={() => actionsNAV.openSupportPage()}
        position={{ top: TOP, right: RIGHT + stn.ui.FLOAT_BTN_PADDING }}
      />

      {page == "champ" && (
        <FabAnimated
          tooltip={"На главную"}
          icon="home"
          action={() => actionsNAV.openAllCoursePage()}
          position={{ top: TOP, right: RIGHT + 2 * stn.ui.FLOAT_BTN_PADDING }}
        />
      )}

      {/* {mode != "search" && state.qrVisible && (
        <FabAnimated
          tooltip={local.ru.tooltip.FAB_COPY_TO_CLIPBOARD}
          icon="copyClipboard"
          visible={true}
          action={actions.copyCB}
          position={{ top: TOP, right: RIGHT + stn.ui.FLOAT_BTN_PADDING }}
        />
      )}
      {mode != "search" && state.qrVisible && (
        <FabAnimated
          tooltip={local.ru.tooltip.FAB_PREVIEW_DROP_FORM}
          icon="openDropWindow"
          visible={true}
          action={actions.openDropWindow}
          position={{ top: TOP, right: RIGHT + 2 * stn.ui.FLOAT_BTN_PADDING }}
        />
      )} */}
    </>
  );
};

export default FloatMenu;
