export const initialNodes = (action) => {
  return [
    {
      id: "1",
      position: { x: 0, y: 0 },
      type: "turbo",
      data: {
        id: "1",
        title: "Вывод данных",
        subline: "Учимся печать данные",
        action: action,
      },
    },
    {
      id: "2",
      position: { x: 0, y: 250 },
      type: "turbo",
      data: {
        id: "2",
        title: "Ввод данных",
        subline: "Учимся получать \nданные извне",
        action: "action",
      },
    },
    {
      id: "3",
      position: { x: 0, y: 500 },
      type: "turbo",
      data: {
        id: "3",
        title: "Работа со строками \nна базовом уровне",
        subline: "Учимся получать \nданные извне",
        action: "action",
      },
    },
    {
      id: "4",
      position: { x: 0, y: 750 },
      type: "turbo",
      data: { id: "4", title: "Тест1", subline: "Тест1", action: "action" },
    },
    {
      id: "5",
      position: { x: 400, y: 250 },
      type: "turbo",
      data: { id: "5", title: "Тест2", subline: "Тест2", action: "action" },
    },
  ];
};
export const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e2-5", source: "2", target: "5" },
  { id: "e3-4", source: "3", target: "4" },
];
