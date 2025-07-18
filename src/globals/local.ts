const local = {
  ru: {
    defaults: {
      NEW_SURVEY: "Новый опрос",
      BLACKBOARD_TEXT:
        "ЗАДАНИЕ[шаблон]\n\n1)Скачай файл из задания\n2)Заполни файл\n3)Перейди с телефона по ссылке в QR-коде, нажми на область загрузки файлов. Выбери файлы и отправь учителю\n\nили\n\nПерейди с телефона по ссылке в QR-коде, нажми на область загрузки файлов. Cфотографируй документ с монитора, так чтобы был виден номер ПК и отправь учителю\n\nили\n\nОткрой ссылку на компьютере,выбери файлы и отправь их учителю\n\nУдачи!!!",
    },
    text: {
      APP_NAME: "PyTrek",
      APP_DESCRIPTION: "pyTrek-самый быстрый способ научиться программировать",
      DROP_UNITS: "байт",
      AUTH_REMEMBER: "Вспомнил!",
      AUTH_FORGOT: "Сбросить пароль",
      AUTH_HAVE_ACCOUNT: "Уже есть аккаунт?",
      AUTH_HAVE_NOACCOUNT: "Нет аккаунта?",
      PICK_SURVEY_TYPE: "Что будем делать?",
      PICK_FILE_TYPE: "Что будем собирать?",
      UPLOAD_TEXT:
        " Максимальный размер файла 10 мегабайт, файл не появится в списке на загрузку, если он больше 10 мегабайт",
      DROP_GUIDE_IMG: `Перетащите сюда изображения(bmp,jpeg,gif,png) или нажмите на область для загрузки вручную`,
      DROP_GUIDE_FILES: `Перетащите сюда файлы или нажмите на область для загрузки вручную`,
      DROP_GUIDE_SINGLEFILE: `Перетащите сюда один файл или нажмите на область для загрузки вручную`,
    },
    tooltip: {
      FAB_SHOWQR: "Показать QR-код",
      FAB_COPY_TO_CLIPBOARD: "Копировать ссылку на опрос в буфер",
      FAB_PREVIEW_DROP_FORM: "Открыть форму сбора данных",
      FAB_PICK_FILE_TYPE: "Выбрать тип файлов, которые вы будете собирать",
      FAB_SHOW_NOTE: "Показать заметки к опросу",
      FAB_DOWNLOD_ALL: "Скачать все файлы опроса в одном архиве",
      FAB_SAVE_NOTE: "Сохранить заметку",

      FAB_UNDO_PAINT: "Отменить пометку",
      FAB_SAVE_IMG: "Сохранить пометки",
      FAB_HIDE_IMG: "Скрыть картинку",
      FAB_ROTATE_IMG: "Повернуть картинку",

      TOOLBAR_ADD_NEW_SYRVEY: "Добавить новый опрос",
      TOOLBAR_SEARCH_FILE: "Поиск файлов по имени опрашиваемого",
      GRID_DOWNLOAD_FILE: "Скачать файл",
      GRID_VIEW_SURVEY: "Открыть опрос",
      GRID_VIEW_IMG: "Показать картинку",
      TYPE_TASK:
        "Выберите этот вариант, если нужно собрать результаты проверочных работ с указанием варианта или номера задачи",
      TYPE_COLLECTION:
        "Выберите этот вариант, если нужно просто собрать разные файлы",
      TYPE_IMG:
        "Выберите этот вариант, если нужно собрать одну или несколько картинок или фотографий",
      TYPE_FILE: "Выберите этот вариант, если нужно собрать один любой файл",
      TYPE_ZIP: "Выберите этот вариант, если нужно собрать несколько файлов",
      TYPE_TEXT: "В этом варианте текст заполняется прямо в окне опроса",
    },
    gridcols: {
      FILES_FILENAME: "Файл",
      FILES_DATE: "Дата изменения",
      FILES_VARIANT: "Вариант",
      FILES_SURVEYNAME: "Опрос",
      SURVEYS_NAME: "Имя",
      SURVEYS_DATE: "Дата и время",
    },
    caption: {
      DROP_ENTER_NAME: "Укажи фамилию",
      DROP_ENTER_TASKID: "Введи номер задания или вариант",
      DROP_SEND_BTN: "Отправить",
      DROP_SEND_CONGRAT: "Отправить еще раз",
      AUTH_RESETPSW: "ВОССТАНОВИТЬ ПАРОЛЬ",
      AUTH_SIGNIN: "Войти",
      AUTH_ENTER_EMAIL: "Введите email",
      AUTH_ENTER_NICKNAME: "Введите имя",
      AUTH_ENTER_TASKNUM: "Количество задач",
      AUTH_ENTER_CHAMPID: "Номер чемпионата",
      AUTH_ENTER_FIRSTNAME: "Введите имя",
      AUTH_ENTER_SECONDNAME: "Введите фамилию",

      AUTH_ENTER_PSW: "Введите пароль",
      AUTH_ENTER_NAME: "Введите имя",
      AUTH_ENTER_COMPANY: "Введите организацию",
      AUTH_SIGNUP: "Создать",

      FILE_TYPE_IMG: "Изображения",
      FILE_TYPE_ANYFILE: "Любые файлы",
      FILE_TYPE_SINGLEFILE: "Один любой файл",
      FILE_TYPE_TEXT: "Текст",
      SURVEY_TYPE_TASK: "Проверка знаний",
      SURVEY_TYPE_COLLECTION: "Простой сбор файлов",

      AUTH_LOGOUT: "Выйти",

      ALERT_OK: "Ok",
    },
    msg: {
      snack: {
        PICK_FILES: "Ты хоть выбери что-нибудь :(",
        PICK_NAME: "Введи свою фамилию, будь другом...",
        PICK_TASKID: "Введи номер задания или вариант",
        INPUT_TEXT: "Введи любой текст",

        JOB_DONE: "Все OK! Молодец",
        WRONG_EXT: "Файл не поддерживается, возможно нужно добавить расширение",

        AUTH_ENTER_VALID_EMAIL: "Введите правильный email",
        AUTH_ENTER_VALID_NICKNAME: "Введите имя для таблицы результатов",
        AUTH_ENTER_VALID_TASKNUM: "Введите количество задач до 99",
        AUTH_ENTER_VALID_CHAMPID: "Введите номер чемпионата",
        AUTH_ENTER_VALID_FIRSTNAME: "Имя с большой буквы",
        AUTH_ENTER_VALID_SECONDNAME: "Фамилия с большой буквы",

        // AUTH_ENTER_VALID_EMAIL: "Please enter a valid email address.",
        AUTH_ENTER_VALID_PSW: "Password must be at least 6 characters long.",
        // AUTH_ENTER_VALID_PSW: "Пароль должен быть более 5 символов",
        AUTH_ENTER_VALID_NAME: "Введите имя",
        // AUTH_ENTER_VALID_NAME: "Name is required.",
        AUTH_ENTER_VALID_COMPANY: "Company is required.",
      },
      alert: {
        PSW_RECOVERY_TITLE: "Проверь почту",
        PSW_TEST_ERROR: "Неверный ответ",

        PSW_RECOVERY_TEXT:
          "На ваш почтовый ящик выслано письмо, перейдите по ссылке в письме для смены пароля",
        PSW_ACOUNT_CREATED_TITLE: "Ваш аккаунт успешно создан!",
        PSW_ACOUNT_CREATED_TEXT:
          "На ваш почтовый ящик выслано письмо, перейдите по ссылке в письме для активации аккаунта",
      },
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

export default local;
