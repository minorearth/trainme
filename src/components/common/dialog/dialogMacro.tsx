import alertdialog from "@/components/common/dialog/store";
import { L } from "@/tpconst/src/lang";
import { UnitsetMode } from "@/tpconst/src/T";
import { TSM } from "@/tpconst/src/const";

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

  textnvalue: ({
    text,
    value,
    caption,
  }: {
    text: string;
    value: string;
    caption: string;
  }) => alertdialog.showDialog(caption, `${text} ${value}`, 1, () => {}),

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
      () => {},
    );
  },
};

export const getUnitSetInterruptedInfo = ({
  completed,
  unitsetmode,
}: {
  completed: boolean;
  unitsetmode: UnitsetMode;
}) => {
  let caption, text;
  if (
    unitsetmode == TSM.exam ||
    unitsetmode == TSM.addhoc ||
    unitsetmode == TSM.newtopic
  ) {
    caption = L.ru.INTERRUPT.INTERRUPT_CAPTION;
  }

  if (
    (unitsetmode == TSM.newtopic || unitsetmode == TSM.addhoc) &&
    !completed
  ) {
    text = L.ru.INTERRUPT.INTERRUPT_TEXT1;
  }

  if (unitsetmode == TSM.exam && !completed) {
    text = L.ru.INTERRUPT.INTERRUPT_TEXT2;
  }

  if (completed) {
    text = L.ru.INTERRUPT.INTERRUPT_TEXT3;
  }

  if (unitsetmode == TSM.champ) {
    caption = L.ru.INTERRUPT.INTERRUPT_CHAMP_CAPTION;
    text = L.ru.INTERRUPT.INTERRUPT_CHAMP_TEXT;
  }

  return { caption, text };
};

export const getStarPageIntro = ({
  unitsetmode,
  completed,
  overflow,
}: {
  unitsetmode: UnitsetMode;
  completed: boolean;
  overflow: boolean;
}) => {
  if (unitsetmode == TSM.textbook) {
    return L.ru.SPG.INTRO1;
  }

  if (unitsetmode == TSM.champ) {
    return L.ru.SPG.INTRO2;
  }

  if (unitsetmode == TSM.exam) return L.ru.SPG.INTRO3;

  if (unitsetmode == TSM.addhoc || unitsetmode == TSM.newtopic) {
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
