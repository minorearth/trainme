const L = {
  ru: {
    text: {
      APP_NAME: "PyTrek",
      APP_DESCRIPTION: "pyTrek-самый быстрый способ научиться программировать",
      JOINED_GROUP: "Вы присоединились к группе! Вкладку можно закрыть!",
      WAITING_FOR_PAARTICIPANTS: "Ожидаем участников...",
    },
    //tooltips
    TT: {
      GOMAINPAGE: "Вернуться на главную",
      TEXTBOOK: "Учебник",
      HOWTO_GUIDE: "Как проходить курс",
      INTERRUPT_CHAPTER: "Заверить прохождение",
      EXIT: "Выйти",
    },
    links: {
      AUTH_REMEMBER: "Вспомнил!",
      AUTH_FORGOT: "Сбросить пароль",
      AUTH_HAVE_ACCOUNT: "Уже есть аккаунт?",
      AUTH_HAVE_NOACCOUNT: "Нет аккаунта?",
      AUTH_SIGNIN: "Войти",
      AUTH_SIGNUP: "Создать",
    },
    buttons: {
      ALERT_OK: "Ok",
      ALERT_CANCEL: "Отмена",
      AUTH_RESETPSW: "Восстановить пароль",

      //lesson start page
      START: "Начать",
      TASK_EXECUTING: "Выполняется...",
      RUNTASSK: "Выполнить",
      PROCEED: "Продолжить",
      NEXT_TASK: "Дальше",
      CHECK_TASK: "Проверить!",

      //champ pagee
      CREATE_CHAMP: "Создать чемпионат",
      START_CHAMP: "Начать",
      JOINCHAMP: "Присоединиться",
      BACK_CHAMP: "Назад",

      //join group
      JOIN_GROUP: "Присоединиться",
    },
    //custom input
    CI: {
      //title
      AUTH_ENTER_EMAIL: "Введите email",
      AUTH_ENTER_NICKNAME: "Введите имя",
      AUTH_ENTER_TASKNUM: "Количество задач",
      AUTH_ENTER_CHAMPID: "Номер чемпионата",
      AUTH_ENTER_FIRSTNAME: "Введите имя",
      AUTH_ENTER_SECONDNAME: "Введите фамилию",
      AUTH_ENTER_PSW: "Введите пароль",
      AUTH_ENTER_NAME: "Введите имя",

      //validations
      AUTH_ENTER_VALID_EMAIL: "Введите правильный email",
      AUTH_ENTER_VALID_NICKNAME: "Введите имя для таблицы результатов",
      AUTH_ENTER_VALID_TASKNUM: "Введите количество задач до 99",
      AUTH_ENTER_VALID_CHAMPID: "Введите номер чемпионата",
      AUTH_ENTER_VALID_FIRSTNAME: "Имя с большой буквы",
      AUTH_ENTER_VALID_SECONDNAME: "Фамилия с большой буквы",
      AUTH_ENTER_VALID_PSW: "Минимум  6 символов в пароле",
      AUTH_ENTER_VALID_NAME: "Введите имя",
    },
    //ChampPage
    CH: {
      COMPLEXITY: "Сложность",
    },
    //Taskrun
    TR: {
      INPUT_DATA: "Входные данные",
      OUTPUTT_DATA: "Выходные данные",
      EXPECTED_OUTPUT: "Ожидаемый результат",
      TASK: "Выполни задание",
      EDITOR: "Редактор кода",

      //Task limitations
      LIMITATIONS_CAPTION: "Ограничения",
      LIMITATIONS_MAXLINES: "Максимальное количество строк кода:",
      LIMITATIONS_FORBIDDEN: "Запрещенные приёмы:",
    },
    // Congrat page
    CG: {
      SAVE_AND_EXIT: "Сохранить и завершить",
      COINS_EARNED: "Заработанные монеты: ",
    },
    //Reports and groups
    RT: {
      NAME: "Имя",
      COMPLETED_CHAPTERS: "Завершенные темы",
      STATS: "Статистика",
      TASK: "Задача",
      RIGHT_CODE: "Засчитанный код",
      ERROR_CODE: "Последний неправильный код",
    },

    //lesson start page
    SPG: {
      INTRO1:
        "Приветствуем вас в учебнике 📘 ! В учебнике доступна теория только по открытым темам",
      INTRO2: "Удачи в чемпионате!",
      INTRO3:
        "В режиме челлендж нет повторения и все задачи должны быть решены с первого раза",
      INTRO4:
        "Постарайтесь решить задачу с первого раза, за это начисляются монеты, которые используются для открытия новых уроков",
      INTRO5:
        "Вы достигли лимита монет по этой главе😭, здесь вы уже их не заработаете🚫",
      INTRO6: "В режиме повторения начисляется гораздо меньше монет",
    },
    msg: {
      PSW_RECOVERY_TITLE: "Проверь почту",
      PSW_TEST_ERROR: "Неверный ответ",
      PSW_RECOVERY_TEXT:
        "На ваш почтовый ящик выслано письмо, перейдите по ссылке в письме для смены пароля",
      PSW_ACOUNT_CREATED_TITLE: "Ваш аккаунт успешно создан!",
      PSW_ACOUNT_CREATED_TEXT:
        "На ваш почтовый ящик выслано письмо, перейдите по ссылке в письме для активации аккаунта",
      WRONG_PSW_CAPTION: "Неверный логин или пароль",
      WRONG_PSW_TEXT: "Перепроверьте все еще раз",
      EMAIL_NOT_VERYFIED_CAPTION: "email не верифицирован",
      EMAIL_NOT_VERYFIED_TEXT:
        "На ваш почтовый ящик выслано письмо, \nперейдите по ссылке в письме для смены пароля",
      CHAPTER_BLOCKED_CAPTION: "Заблокировано",
      CHAPTER_BLOCKED_TEXT:
        "Данный раздел пока заблокирован. \nВыполните задания предыдущего раздела",
      NOTPAID_BUY_CAPTION: "Не  оплачен",
      NOTPAID_BUY_TEXT: "Данный раздел не оплачен. Купить?",
      NOTPAID_NO_MONEY_CAPTION: "Не  оплачен",
      NOTPAID_NO_MONEY_TEXT: "Данный раздел не оплачен. Не хватает монет",
      BLOCKED_AND_NOTPAID_CAPTION: "Заблокировано и не оплачено",
      BLOCKED_AND_NOTPAID_TEXT:
        "Данный раздел пока заблокирован. \nВыполните задания предыдущего раздела,\nа потом оплатите монетками",
      COURSE_IS_DISABLED_CAPTION: "Курс недоступен",
      COURSE_IS_DISABLED_TEXT: "Данный курс пока недоступен",
      TEXTBOOK_BLOCKED_CAPTION: "В учебнике нет отрытых тем",
      TEXTBOOK_BLOCKED_TEXT:
        "Темы в учебнике открываются по мере проходжения курса",
      NETWORK_ERROR_CAPTION: "Сохранение данных",
      NETWORK_ERROR_TEXT: ' "Что-то пошло не так, повторите попытку...',
      NOT_ENOUGHT_TASKS_CAPTION: "Ошибка",
      NOT_ENOUGHT_TASKS_TEXT_PART1: `По выбранной сложности недостаточно задач. Доступное количество задач: `,
      NOT_ENOUGHT_TASKS_TEXT_PART2: `. Измените уровень сложности.`,
      CHAMP_COMEBACK_CAPTION: "Ошибка",
      CHAMP_COMEBACK_TEXT: "Ты вышел из чемпионата, обратно уже не зайти..",
      CHAMPOVER_CAPTION: "Ошибка",
      CHAMPOVER_TEXT: "Ты уже поучаствовал в этом чемпионате",
      NOCHAMP_CAPTION: "Нет такого чемпионата",
      NOCHAMP_TEXT: "Перепроверьте все еще раз",
      RECAP_CAPTION: "Повторение",
      RECAP_TEXT: "Попробуй еще раз решить ошибочные задачи",

      INTERRUPT_CAPTION: "Завершить",
      INTERRUPT_TEXT1:
        "Если досрочно завершить прохождение, \nто при повторном запуске вы будете получать \n2 монеты за каждую задачу вместо 10 монет",
      INTERRUPT_TEXT2:
        "Если досрочно завершить прохождение, \nто при повторном запуске вы будете получать \n1 монету за каждую задачу вместо 2 монет",
      INTERRUPT_TEXT3: "Завершить прохождение?",
      INTERRUPT_CHAMP_CAPTION: "Завершить чемпионат",
      INTERRUPT_CHAMP_TEXT: "Завершить участие в чемпионате?",
    },
    //Monaco Editor
    ME: {
      EDITOR_INFO: "Изучи правильный код",
      MAX_LINES_ERROR: "Превышено максимальное количество строк",

      RIGHT_CODE: "Правильный код",
      YOUR_CODE: "Твой код:",
    },
    CE: {
      CODE_ERROR_INTRO: "Ты допустил следующие ошибки:\n\n ",
      CODE_ERROR_FOOTER: `\n\nСмотри верный код в окне редактора!`,
      error1: "в программе нет нужных функций или операторов",
      error2: "количество строчек программы больше нужного",
      error3:
        "Ты написал код, который выдает правильные данные, но количество строчек программы больше нужного и не использованы нужные функции или операторы",
      error4: "написал неправильный код",
      error5: "Возникла ошибка!\n",
      error6: "в программе есть запрещенные функции или операторы",
    },
    //settings
    ST: {
      NEW_GROUP: "Новая группа",
    },
    forbiddentsample: {
      "f-строки": "Пример: f'Привет, {a}",
      "индексы строк": "Пример: a=b[2]",
      срезы: "Пример: a=b[1:5:-1]",
      "списковые включения": "Пример: [i for i in range(a)]",
      списки: "Пример, a.append(b), print(a[i])",
      "тернарный оператор": "Пример: a if a>b else b",
      "условный оператор in": "Пример: if a in b: print(a)",
      "функция sum": "Пример: sum([1,2,3])",
      "функция count": "Пример: a.count('A')",
      "функция max": "Пример: max([1,2,3])",
      "функция min": "Пример: min([1,2,3]",
      "функция len": "Пример: len([1,2,3]),len('ABC')",
      "функция map": "Пример: map(int, a)",
      "функция list": "Пример: list('ABC')",
      "функция join": "Пример: a=''.join(b)",
      "функция split": "Пример: a=b.split()",
      "функция find": "Пример: a=b.find('A')",
      "функция rfind": "Пример: a=b.rfind('A')",
      "функция replace": "Пример: a=a.replace('A','B')",
    } as {
      [key: string]: string;
    },
  },
};

export default L;
