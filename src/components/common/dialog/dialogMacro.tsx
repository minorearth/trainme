import alertdialog from "@/components/common/dialog/store";
import splash from "@/components/common/splash/store";
import L from "@/globals/local";
import { TasksetMode } from "@/T/typesBasic";
import { TSM } from "@/T/const";

export const da = {
  info: {
    DBNotFound: () =>
      alertdialog.showDialog(
        L.ru.msg.FIRESTORE_ERROR_CAPTION,
        L.ru.msg.FIRESTORE_NOTFOUND_TEXT,
        1,
        () => {
          splash.closeProgress();
        }
      ),

    wrongpsw: () =>
      alertdialog.showDialog(
        L.ru.msg.WRONG_PSW_CAPTION,
        L.ru.msg.WRONG_PSW_TEXT,
        1,
        () => {
          splash.closeProgress();
        }
      ),
    emailnotverified: () =>
      alertdialog.showDialog(
        L.ru.msg.EMAIL_NOT_VERYFIED_CAPTION,
        L.ru.msg.EMAIL_NOT_VERYFIED_TEXT,
        1,
        () => {
          splash.closeProgress();
        }
      ),
    accountcreeated: (action: () => void) =>
      alertdialog.showDialog(
        L.ru.msg.PSW_ACOUNT_CREATED_TITLE,
        L.ru.msg.PSW_ACOUNT_CREATED_TEXT,
        1,
        () => action()
      ),
    resetpsw: (action: () => void) =>
      alertdialog.showDialog(
        L.ru.msg.PSW_RECOVERY_TITLE,
        L.ru.msg.PSW_RECOVERY_TEXT,
        1,
        () => action()
      ),
    blocked: () =>
      alertdialog.showDialog(
        L.ru.msg.CHAPTER_BLOCKED_CAPTION,
        L.ru.msg.CHAPTER_BLOCKED_TEXT,
        1,
        () => {}
      ),
    buy: (action: () => void) =>
      alertdialog.showDialog(
        L.ru.msg.NOTPAID_BUY_CAPTION,
        L.ru.msg.NOTPAID_BUY_TEXT,
        2,
        () => action(),
        () => {}
      ),
    nomoneytobuy: () =>
      alertdialog.showDialog(
        L.ru.msg.NOTPAID_NO_MONEY_CAPTION,
        L.ru.msg.NOTPAID_NO_MONEY_TEXT,
        1,
        () => {}
      ),
    notpaidblocked: () =>
      alertdialog.showDialog(
        L.ru.msg.BLOCKED_AND_NOTPAID_CAPTION,
        L.ru.msg.BLOCKED_AND_NOTPAID_TEXT,
        1,
        () => {}
      ),
    courseblocked: () => {
      alertdialog.showDialog(
        L.ru.msg.COURSE_IS_DISABLED_CAPTION,
        L.ru.msg.COURSE_IS_DISABLED_TEXT,
        1,
        () => {
          splash.closeProgress();
        }
      );
    },
    unknownerror: () => {
      alertdialog.showDialog(
        L.ru.msg.UNKNOWNERROR_CAPTION,
        L.ru.msg.UNKNOWNERROR_TEXT,
        1,
        () => {
          splash.closeProgress();
        }
      );
    },
    textbookblocked: () =>
      alertdialog.showDialog(
        L.ru.msg.TEXTBOOK_BLOCKED_CAPTION,
        L.ru.msg.TEXTBOOK_BLOCKED_TEXT,
        1,
        () => {
          splash.closeProgress();
        }
      ),
    networkerror: (e: unknown) =>
      alertdialog.showDialog(
        L.ru.msg.NETWORK_ERROR_CAPTION,
        L.ru.msg.NETWORK_ERROR_TEXT,
        1,
        () => {
          console.log(e);
          splash.closeProgress();
        }
      ),
    tasksetinterrupt: ({
      action,
      completed,
      tasksetmode,
    }: {
      action: () => void;
      completed: boolean;
      tasksetmode: TasksetMode;
    }) => {
      const { caption = "", text = "" } = getTaskSetInterruptedInfo(
        completed,
        tasksetmode
      );
      alertdialog.showDialog(
        caption,
        text,
        2,
        () => action(),
        () => {}
      );
    },
    rightcode: (action: () => void, errorMsg: string) =>
      alertdialog.showDialog(L.ru.msg.PSW_TEST_ERROR, errorMsg, 1, () =>
        action()
      ),
    notenoughttasks: (count: number) =>
      alertdialog.showDialog(
        L.ru.msg.NOT_ENOUGHT_TASKS_CAPTION,
        `${L.ru.msg.NOT_ENOUGHT_TASKS_TEXT_PART1} ${count}${L.ru.msg.NOT_ENOUGHT_TASKS_TEXT_PART2}`,
        1,
        () => {}
      ),
    champblocked: () =>
      alertdialog.showDialog(
        L.ru.msg.CHAMP_COMEBACK_CAPTION,
        L.ru.msg.CHAMP_COMEBACK_TEXT,
        1,
        () => {}
      ),
    champover: () =>
      alertdialog.showDialog(
        L.ru.msg.CHAMPOVER_CAPTION,
        L.ru.msg.CHAMPOVER_TEXT,
        1,
        () => {}
      ),
    nochamp: (e: unknown) => {
      console.log(e);
      alertdialog.showDialog(
        L.ru.msg.NOCHAMP_CAPTION,
        L.ru.msg.NOCHAMP_TEXT,
        1,
        () => {}
      );
    },
    recap: () =>
      alertdialog.showDialog(
        L.ru.msg.RECAP_CAPTION,
        L.ru.msg.RECAP_TEXT,
        1,
        () => {}
      ),
  },
  okCancel: {},
  ok: {},
};

const getTaskSetInterruptedInfo = (
  completed: boolean,
  tasksetmode: TasksetMode
) => {
  let caption, text;
  if (
    tasksetmode == TSM.exam ||
    tasksetmode == TSM.addhoc ||
    tasksetmode == TSM.newtopic
  ) {
    caption = L.ru.msg.INTERRUPT_CAPTION;
  }

  if (
    (tasksetmode == TSM.newtopic || tasksetmode == TSM.addhoc) &&
    !completed
  ) {
    text = L.ru.msg.INTERRUPT_TEXT1;
  }

  if (tasksetmode == TSM.exam && !completed) {
    text = L.ru.msg.INTERRUPT_TEXT2;
  }

  if (completed) {
    text = L.ru.msg.INTERRUPT_TEXT3;
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
