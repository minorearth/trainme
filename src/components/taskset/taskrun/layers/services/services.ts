import { toJS } from "mobx";
import { da } from "@/components/common/dialog/dialogMacro";

//stores
import countdownbutton from "@/components/common/CountdownButton/store";
import task from "@/components/taskset/taskrun/layers/store/task";

export const showRightCodeAfterError = ({ errorMsg }: { errorMsg: string }) => {
  da.info.rightcode(() => {
    task.showInfo("Изучи правильный код");
    countdownbutton.showButton();
  }, errorMsg);
};
