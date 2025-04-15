import alertdialog from "@/components/common/dialog/store";

export const updateDataWithTimeout = async (action, timeout = 2000) => {
  return Promise.race([
    action(),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Запрос превысил время ожидания")),
        timeout
      )
    ),
  ]);
};

const showNetworkMessage = (message) => {
  alertdialog.showDialog("Сохранение данных", message, 3, () => {});
};

export const updateDataWithRetry = async (action, retries = 5) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await updateDataWithTimeout(() => action());

      // alertdialog.cancelDialog();
      return;
    } catch (error) {
      // if (0 < attempt) {
      showNetworkMessage(
        `Попытка ${
          attempt + 1
        } не удалась из-за сетевой ошибки. \nПовторная попытка...`
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
      // }

      // if (attempt == retries - 1) {
      //   showNetworkMessage(
      //     "Что-то не так с интернетом...\nОбновите страницу и повторите попытку\nЧтобы сохранить набранные баллы нужен интернет"
      //   );
      // }
    }
  }
  throw error;
};
