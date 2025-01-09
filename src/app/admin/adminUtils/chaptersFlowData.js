export const chapterFlowNodes = [
  {
    id: "4680f00b-b586-413c-890a-9669b4b7b1c3",
    position: { x: 0, y: 0 },
    type: "turbo",
    data: {
      id: "4680f00b-b586-413c-890a-9669b4b7b1c3",
      title: "Вывод данных",
      subline: "Учимся печать данные",
    },
  },
  {
    id: "53945ea5-7a89-44eb-b43f-03de6bef8390",
    position: { x: 0, y: 250 },
    type: "turbo",
    data: {
      id: "53945ea5-7a89-44eb-b43f-03de6bef8390",
      title: "Ввод данных",
      subline: "Учимся получать \nданные извне",
    },
  },
  {
    id: "31ecf55a-c0e2-4246-b2b2-f0e919057467",
    position: { x: 0, y: 500 },
    type: "turbo",
    data: {
      id: "31ecf55a-c0e2-4246-b2b2-f0e919057467",
      title: "Работа со строками \nна базовом уровне",
      subline: "Учимся получать \nданные извне",
    },
  },
  {
    id: "f5fa5312-f89e-44c7-b6d7-5601bd0a5638",
    position: { x: 0, y: 750 },
    type: "turbo",
    data: {
      id: "f5fa5312-f89e-44c7-b6d7-5601bd0a5638",
      title: "Тест1",
      subline: "Тест1",
    },
  },
  {
    id: "1fe8a12f-9a77-488a-af6d-444a6c3fb83a",
    position: { x: 400, y: 250 },
    type: "turbo",
    data: {
      id: "1fe8a12f-9a77-488a-af6d-444a6c3fb83a",
      title: "Тест2",
      subline: "Тест2",
    },
  },
];
export const chapterFlowEdges = [
  {
    id: "e4680f00b-b586-413c-890a-9669b4b7b1c3-53945ea5-7a89-44eb-b43f-03de6bef8390",
    source: "4680f00b-b586-413c-890a-9669b4b7b1c3",
    target: "53945ea5-7a89-44eb-b43f-03de6bef8390",
  },
  {
    id: "e53945ea5-7a89-44eb-b43f-03de6bef8390-31ecf55a-c0e2-4246-b2b2-f0e919057467",
    source: "53945ea5-7a89-44eb-b43f-03de6bef8390",
    target: "31ecf55a-c0e2-4246-b2b2-f0e919057467",
  },
  {
    id: "e53945ea5-7a89-44eb-b43f-03de6bef8390-1fe8a12f-9a77-488a-af6d-444a6c3fb83a",
    source: "53945ea5-7a89-44eb-b43f-03de6bef8390",
    target: "1fe8a12f-9a77-488a-af6d-444a6c3fb83a",
  },
  {
    id: "e31ecf55a-c0e2-4246-b2b2-f0e919057467-f5fa5312-f89e-44c7-b6d7-5601bd0a5638",
    source: "31ecf55a-c0e2-4246-b2b2-f0e919057467",
    target: "f5fa5312-f89e-44c7-b6d7-5601bd0a5638",
  },
];
