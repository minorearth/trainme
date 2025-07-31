import alertdialog from "@/components/common/dialog/store";
import { L } from "tpconst/lang";
import { TasksetMode } from "tpconst/T";
import { TSM } from "tpconst/constants";

export const dialogs: { [dialogtype: string]: (...params: any) => void } = {
  basic: ({ text, caption }: { text: string; caption: string }) =>
    alertdialog.showDialog(caption, text, 1, () => {}),
  action: ({
    text,
    caption,
    action,
  }: {
    text: string;
    caption: string;
    action: () => void;
  }) => alertdialog.showDialog(caption, text, 1, () => action()),
  twojoin: ({
    text1,
    text2,
    value,
    caption,
  }: {
    text1: string;
    text2: string;
    value: string;
    caption: string;
  }) =>
    alertdialog.showDialog(caption, `${text1} ${value} ${text2}`, 1, () => {}),

  okCancel: ({
    action,
    text,
    caption,
  }: {
    action: () => void;
    text: string;
    caption: string;
  }) => {
    alertdialog.showDialog(
      caption,
      text,
      2,
      () => action(),
      () => {}
    );
  },
};

export const getTaskSetInterruptedInfo = ({
  completed,
  tasksetmode,
}: {
  completed: boolean;
  tasksetmode: TasksetMode;
}) => {
  let caption, text;
  if (
    tasksetmode == TSM.exam ||
    tasksetmode == TSM.addhoc ||
    tasksetmode == TSM.newtopic
  ) {
    caption = L.ru.INTERRUPT.INTERRUPT_CAPTION;
  }

  if (
    (tasksetmode == TSM.newtopic || tasksetmode == TSM.addhoc) &&
    !completed
  ) {
    text = L.ru.INTERRUPT.INTERRUPT_TEXT1;
  }

  if (tasksetmode == TSM.exam && !completed) {
    text = L.ru.INTERRUPT.INTERRUPT_TEXT2;
  }

  if (completed) {
    text = L.ru.INTERRUPT.INTERRUPT_TEXT3;
  }

  if (tasksetmode == TSM.champ) {
    caption = L.ru.msg.INTERRUPT_CHAMP_CAPTION;
    text = L.ru.msg.INTERRUPT_CHAMP_TEXT;
  }

  return { caption, text };
};

export const getStarPageIntro = ({
  tasksetmode,
  completed,
  overflow,
}: {
  tasksetmode: TasksetMode;
  completed: boolean;
  overflow: boolean;
}) => {
  if (tasksetmode == TSM.textbook) {
    return L.ru.SPG.INTRO1;
  }

  if (tasksetmode == TSM.champ) {
    return L.ru.SPG.INTRO2;
  }

  if (tasksetmode == TSM.exam) return L.ru.SPG.INTRO3;

  if (tasksetmode == TSM.addhoc || tasksetmode == TSM.newtopic) {
    if (!completed) {
      return L.ru.SPG.INTRO4;
    }
    if (overflow) {
      return L.ru.SPG.INTRO5;
    }
    if (completed) {
      return L.ru.SPG.INTRO6;
    }
  }
};
