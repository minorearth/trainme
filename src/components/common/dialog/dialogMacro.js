import alertdialog from "@/components/common/dialog/store";
import splash from "@/components/common/splash/store";
import local from "@/globals/local";

export const da = {
  info: {
    wrongpsw: () =>
      alertdialog.showDialog(
        "Неверный логин или пароль",
        "Перепроверьте все еще раз",
        1,
        () => {
          splash.closeProgress();
        }
      ),
    emailnotverified: () =>
      alertdialog.showDialog(
        "email не верифицирован",
        "На ваш почтовый ящик выслано письмо, \nперейдите по ссылке в письме для смены пароля",
        1,
        () => {
          splash.closeProgress();
        }
      ),
    accountcreeated: (action) =>
      alertdialog.showDialog(
        local.ru.msg.alert.PSW_ACOUNT_CREATED_TITLE,
        local.ru.msg.alert.PSW_ACOUNT_CREATED_TEXT,
        1,
        () => action()
      ),
    resetpsw: (action) =>
      alertdialog.showDialog(
        local.ru.msg.alert.PSW_RECOVERY_TITLE,
        local.ru.msg.alert.PSW_RECOVERY_TEXT,
        1,
        () => action()
      ),
    blocked: () =>
      alertdialog.showDialog(
        "Заблокировано",
        "Данный раздел пока заблокирован. \nВыполните задания предыдущего раздела",
        1,
        () => {}
      ),
    buy: (action) =>
      alertdialog.showDialog(
        "Не  оплачен",
        "Данный раздел не оплачен. Купить?",
        2,
        () => action(),
        () => {}
      ),
    nomoneytobuy: () =>
      alertdialog.showDialog(
        "Не  оплачен",
        "Данный раздел не оплачен. Не хватает монет",
        1,
        () => {}
      ),
    notpaidblocked: () =>
      alertdialog.showDialog(
        "Заблокировано и не оплачено",
        "Данный раздел пока заблокирован. \nВыполните задания предыдущего раздела,\nа потом оплатите монетками",
        1,
        () => {}
      ),
    courseblocked: () => {
      alertdialog.showDialog(
        "Курс недоступен",
        "Данный курс пока недоступен",
        1,
        () => {
          splash.closeProgress();
        }
      );
    },
    textbookblocked: () =>
      alertdialog.showDialog(
        "В учебнике нет отрытых тем",
        "Темы в учебнике открываются по мере проходжения курса",
        1,
        () => {
          splash.closeProgress();
        }
      ),
    networkerror: (e) =>
      alertdialog.showDialog(
        "Сохранение данных",
        ' "Что-то пошло не так, повторите попытку...',
        1,
        () => {
          console.log(e);
          splash.closeProgress();
        }
      ),
    tasksetinterrupt: ({ action, completed, nodemode }) => {
      const { caption, text } = getTaskSetInterruptedInfo(completed, nodemode);
      alertdialog.showDialog(
        caption,
        text,
        2,
        () => action(),
        () => {}
      );
    },
    rightcode: (action, errorMsg) =>
      alertdialog.showDialog(
        local.ru.msg.alert.PSW_TEST_ERROR,
        errorMsg,
        1,
        () => action()
      ),
    notenoughttasks: (count) =>
      alertdialog.showDialog(
        "Ошибка",
        `По выбранной сложности недостаточно задач. Доступное количество задач: ${count}. Измените уровень сложности.`,
        1,
        () => {}
      ),
    champblocked: () =>
      alertdialog.showDialog(
        "Ошибка",
        "Ты вышел из чемпионата, обратно уже не зайти..",
        1,
        () => {}
      ),
    champover: () =>
      alertdialog.showDialog(
        "Ошибка",
        "Ты уже поучаствовал в этом чемпионате",
        1,
        () => {}
      ),
    nochamp: (e) => {
      console.log(e);
      alertdialog.showDialog(
        "Нет такого чемпионата",
        "Перепроверьте все еще раз",
        1,
        () => {}
      );
    },
    recap: () =>
      alertdialog.showDialog(
        "Повторение",
        "Попробуй еще раз решить ошибочные задачи",
        1,
        () => {}
      ),
  },
  okCancel: {},
  ok: {},
};

const getTaskSetInterruptedInfo = (completed, nodemode) => {
  let caption, text;
  if (nodemode == "exam" || nodemode == "addhoc" || nodemode == "newtopic") {
    caption = "Завершить";
  }

  if ((nodemode == "newtopic" || nodemode == "addhoc") && !completed) {
    text =
      "Если досрочно завершить прохождение, \nто при повторном запуске вы будете получать \n2 монеты за каждую задачу вместо 10 монет";
  }

  if (nodemode == "exam" && !completed) {
    text =
      "Если досрочно завершить прохождение, \nто при повторном запуске вы будете получать \n1 монету за каждую задачу вместо 2 монет";
  }

  if (completed) {
    text = "Завершить прохождение?";
  }

  if (nodemode == "champ") {
    caption = "Завершить чемпионат";
    text = "Завершить участие в чемпионате?";
  }

  return { caption, text };
};

export const getStarPageIntro = ({ nodemode, completed, overflow }) => {
  if (nodemode == "textbook") {
    return "Приветствуем вас в учебнике 📘 ! В учебнике доступна теория только по открытым темам";
  }

  if (nodemode == "champ") {
    return "Удачи в чемпионате!";
  }

  if (nodemode == "exam")
    return "В режиме челлендж нет повторения и все задачи должны быть решены с первого раза";

  if (nodemode == "addhoc" || nodemode == "newtopic") {
    if (!completed) {
      return "Постарайтесь решить задачу с первого раза, за это начисляются монеты, которые используются для открытия новых уроков";
    }
    if (overflow) {
      return "Вы достигли лимита монет по этой главе😭, здесь вы уже их не заработаете🚫";
    }
    if (completed) {
      return "В режиме повторения начисляется гораздо меньше монет";
    }
  }
};
