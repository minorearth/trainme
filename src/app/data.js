export const testsall = [
  {
    chapterid: 1,
    id: 1,
    task: "На входе программы 3 пары чисел, сложи их попарно. Результат напечатай с помощью команды print. В программе используй функцию разделения строк и функцию суммирования.",
    defaultinput: ["1 2", "2 4", "3 4"],
    defaultoutput: ["3", "6", "7"],
    defaultcode:
      "for i in range(3):\n    print(sum(map(int,input().split()))) #Печать",
    inout: [
      { inv: ["1 2", "2 4", "3 4"], outv: ["3", "6", "7"] },
      { inv: ["1 3", "2 4", "3 4"], outv: ["4", "6", "7"] },
    ],
    restrictions: { maxlines: 3, musthave: ["split", "sum"] },
  },
  {
    chapterid: 1,
    id: 2,
    task: "Раздели число в переменной a на 3 нацело. Используй оператор целочисленного деления.",
    defaultinput: ["8"],
    defaultoutput: ["6"],
    defaultcode: "a=input()\nprint(int(a)//3)",
    inout: [
      { inv: ["19"], outv: ["6"] },
      { inv: ["20"], outv: ["6"] },
    ],
    restrictions: { maxlines: 2, musthave: ["//"] },
  },
  {
    chapterid: 1,
    id: 3,
    task: "Используя цикл выведи числа 1,2,3. Каждое число на отдельной строке",
    defaultinput: [""],
    defaultoutput: ["1", "2", "3"],
    defaultcode: "for i in range(1,4):\n    print(i)",
    inout: [
      { inv: [""], outv: ["1", "2", "3"] },
      { inv: [""], outv: ["1", "2", "3"] },
    ],
    restrictions: { maxlines: 2, musthave: ["for"] },
  },
  {
    chapterid: 1,
    id: 4,
    task: "На входе программы 3 числа, возведи каждое в квадрат",
    defaultinput: ["1", "2", "3"],
    defaultoutput: ["1", "4", "9"],
    defaultcode: "for i in range(1,4):\n    print(int(input())**2)",
    inout: [
      { inv: ["1", "2", "3"], outv: ["1", "4", "9"] },
      { inv: ["2", "2", "2"], outv: ["4", "4", "4"] },
    ],
    restrictions: { maxlines: 3, musthave: ["for"] },
  },
  {
    chapterid: 2,
    id: 5,
    task: "На входе программы 8 чисел, вычти из каждого следующего - предыдущее. Из первого числа ничего вычитать не нужно. Результат сложи",
    defaultinput: ["1 2 3 4 5 6 7 8"],
    defaultoutput: ["7"],
    defaultcode:
      "a=input()\nb=a.split()\nsumm=0\nfor i in range(len(b)-1):\n    summ+=int(b[i+1])-int(b[i])\nprint(summ)",
    inout: [
      { inv: ["1 2 3 4 5 6 7 8"], outv: ["7"] },
      { inv: ["1 2 3 4 5 6 7"], outv: ["6"] },
    ],
    restrictions: { maxlines: 7, musthave: ["for", "split", "int"] },
  },
  {
    chapterid: 2,
    id: 6,
    task: "Выведи: Я знаю команду print",
    defaultinput: [""],
    defaultoutput: ["Я знаю команду print"],
    defaultcode: "print('Я знаю команду print')",
    inout: [
      { inv: [""], outv: ["Я знаю команду print"] },
      { inv: [""], outv: ["Я знаю команду print"] },
    ],
    restrictions: { maxlines: 1, musthave: ["print"] },
  },
  {
    chapterid: 2,
    id: 7,
    task: "Выведи: 1 2 3",
    defaultinput: [""],
    defaultoutput: ["1 2 3"],
    defaultcode: "print('1 2 3')",
    inout: [
      { inv: [""], outv: ["1 2 3"] },
      { inv: [""], outv: ["1 2 3"] },
    ],
    restrictions: { maxlines: 1, musthave: ["print"] },
  },
  {
    chapterid: 2,
    id: 8,
    task: "Выведи: 1 2 3. В программе должны обязательно присутствовать запятые",
    defaultinput: [""],
    defaultoutput: ["1 2 3"],
    defaultcode: "print(1, 2, 3)",
    inout: [
      { inv: [""], outv: ["1 2 3"] },
      { inv: [""], outv: ["1 2 3"] },
    ],
    restrictions: { maxlines: 1, musthave: ["print", ","] },
  },
  {
    chapterid: 2,
    id: 9,
    task: "Выведи две строчки:\n1 2 3\nОдин, В программе должны обязательно присутствовать запятые",
    defaultinput: [""],
    defaultoutput: ["1 2 3", "Один Два Три"],
    defaultcode: "print(1, 2, 3)\nprint('Один','Два','Три')",
    inout: [
      { inv: [""], outv: ["1 2 3", "Один Два Три"] },
      { inv: [""], outv: ["1 2 3", "Один Два Три"] },
    ],
    restrictions: { maxlines: 2, musthave: ["print", ","] },
  },
];

export const chapters = [
  {
    id: 1,
    name: "Вывод данных",
    description: "Научимся выводить данные на экран",
  },
  {
    id: 2,
    name: "Ввод данных",
    description: "Научимся получать данные извне",
  },
  {
    id: 3,
    name: "Работа со строками",
    description: "Научимся работать со строками",
  },
];
