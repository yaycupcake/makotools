const centerSkills = [
  { attr: 0, substat: 0 },
  { attr: 1, substat: "Vo" },
  { attr: 1, substat: "Da" },
  { attr: 1, substat: "Pf" },
  { attr: 1, substat: "All" },
  { attr: 2, substat: "Vo" },
  { attr: 2, substat: "Da" },
  { attr: 2, substat: "Pf" },
  { attr: 2, substat: "All" },
  { attr: 3, substat: "Vo" },
  { attr: 3, substat: "Da" },
  { attr: 3, substat: "Pf" },
  { attr: 3, substat: "All" },
  { attr: 4, substat: "Vo" },
  { attr: 4, substat: "Da" },
  { attr: 4, substat: "Pf" },
  { attr: 4, substat: "All" },
];

const liveSkills = {
  5: {
    1: [
      [5, 5],
      [5, 6],
      [5, 7],
      [5, 8],
      [5, 10],
      [5, 11],
      [5, 12],
      [5, 15],
      [5, 20],
      [5, 25],
    ],
    2: [
      [5, 5],
      [5, 6],
      [5, 7],
      [5, 8],
      [5, 10],
      [5, 11],
      [5, 12],
      [5, 15],
      [5, 20],
      [5, 25],
    ],
    3: [
      [5, 10],
      [5, 12],
      [5, 15],
      [5, 17],
      [5, 20],
      [5, 22],
      [5, 25],
      [5, 30],
      [5, 40],
      [5, 50],
    ],
    4: [
      [5, 20],
      [5, 25],
      [5, 30],
      [5, 35],
      [5, 40],
      [5, 45],
      [5, 50],
      [5, 60],
      [5, 70],
      [5, 80],
    ],
    5: [
      [5, 20],
      [5, 25],
      [5, 30],
      [5, 35],
      [5, 40],
      [5, 45],
      [5, 50],
      [5, 60],
      [5, 70],
      [5, 80],
    ],
  },
  8: {
    1: [
      [8, 3],
      [8, 4],
      [8, 5],
      [8, 6],
      [8, 7],
      [8, 8],
      [8, 9],
      [8, 10],
      [8, 12],
      [8, 15],
    ],
    2: [
      [8, 3],
      [8, 4],
      [8, 5],
      [8, 6],
      [8, 7],
      [8, 8],
      [8, 9],
      [8, 10],
      [8, 12],
      [8, 15],
    ],
    3: [
      [8, 6],
      [8, 8],
      [8, 10],
      [8, 12],
      [8, 14],
      [8, 16],
      [8, 18],
      [8, 20],
      [8, 25],
      [8, 30],
    ],
    4: [
      [8, 13],
      [8, 16],
      [8, 20],
      [8, 23],
      [8, 26],
      [8, 30],
      [8, 35],
      [8, 40],
      [8, 45],
      [8, 50],
    ],
    5: [
      [8, 13],
      [8, 16],
      [8, 20],
      [8, 23],
      [8, 26],
      [8, 30],
      [8, 35],
      [8, 40],
      [8, 45],
      [8, 50],
    ],
  },
  12: {
    1: [
      [12, 1],
      [12, 2],
      [12, 3],
      [12, 4],
      [12, 5],
      [12, 6],
      [12, 7],
      [12, 8],
      [12, 9],
      [12, 10],
    ],
    2: [
      [12, 1],
      [12, 2],
      [12, 3],
      [12, 4],
      [12, 5],
      [12, 6],
      [12, 7],
      [12, 8],
      [12, 9],
      [12, 10],
    ],
    3: [
      [12, 4],
      [12, 5],
      [12, 6],
      [12, 7],
      [12, 8],
      [12, 9],
      [12, 10],
      [12, 12],
      [12, 15],
      [12, 20],
    ],
    4: [
      [12, 8],
      [12, 10],
      [12, 12],
      [12, 14],
      [12, 16],
      [12, 18],
      [12, 20],
      [12, 25],
      [12, 30],
      [12, 35],
    ],
    5: [
      [12, 8],
      [12, 10],
      [12, 12],
      [12, 14],
      [12, 16],
      [12, 18],
      [12, 20],
      [12, 25],
      [12, 30],
      [12, 35],
    ],
  },
};

const supportSkills = {
  1: {
    id: 1,
    daydream_name: "VoltageSupport",
    1: [[2], [3], [5], [8], [10]],
    2: [[2], [3], [5], [8], [10]],
    3: [[2], [3], [5], [8], [10]],
    4: [[5], [8], [10], [15], [20]],
    5: [[5], [8], [10], [15], [20]],
  },
  2: {
    id: 2,
    daydream_name: "ComboSupport",
    1: [],
    2: [],
    3: [],
    4: [],
    5: [
      [1, 0, 3],
      [1, 1, 3],
      [1, 1, 4],
      [2, 1, 4],
      [2, 1, 5],
    ],
  },
  3: {
    id: 3,
    daydream_name: "PerfectSupport",
    1: [],
    2: [],
    3: [],
    4: [],
    5: [[1], [2], [3], [4], [5]],
  },
  4: {
    id: 4,
    daydream_name: "EnsembleTimeSupport",
    1: [[2], [3], [5], [8], [10]],
    2: [[2], [3], [5], [8], [10]],
    3: [[2], [3], [5], [8], [10]],
    4: [[5], [8], [10], [15], [20]],
    5: [[5], [8], [10], [15], [20]],
  },
  5: {
    id: 5,
    daydream_name: "PieceUpDaS",
    drop_type: "small red",
    1: [],
    2: [],
    3: [[10], [20], [30], [40], [50]],
    4: [[25], [35], [50], [65], [75]],
    5: [[50], [60], [70], [80], [100]],
  },
  6: {
    id: 6,
    daydream_name: "PieceUpDaM",
    drop_type: "medium red",
    1: [],
    2: [],
    3: [[10], [20], [30], [40], [50]],
    4: [[25], [35], [50], [65], [75]],
    5: [[50], [60], [70], [80], [100]],
  },
  7: {
    id: 7,
    daydream_name: "PieceUpDaL",
    drop_type: "large red",
    1: [],
    2: [],
    3: [[10], [20], [30], [40], [50]],
    4: [[25], [35], [50], [65], [75]],
    5: [[50], [60], [70], [80], [100]],
  },
  8: {
    id: 8,
    daydream_name: "PieceUpDaAll",
    drop_type: "all red",
    1: [],
    2: [],
    3: [],
    4: [],
    5: [[25], [35], [50], [65], [75]],
  },
  9: {
    id: 9,
    daydream_name: "PieceUpVoS",
    drop_type: "small blue",
    1: [],
    2: [],
    3: [[10], [20], [30], [40], [50]],
    4: [[25], [35], [50], [65], [75]],
    5: [[50], [60], [70], [80], [100]],
  },
  10: {
    id: 10,
    daydream_name: "PieceUpVoM",
    drop_type: "medium blue",
    1: [],
    2: [],
    3: [[10], [20], [30], [40], [50]],
    4: [[25], [35], [50], [65], [75]],
    5: [[50], [60], [70], [80], [100]],
  },
  11: {
    id: 11,
    daydream_name: "PieceUpVoL",
    drop_type: "large blue",
    1: [],
    2: [],
    3: [[10], [20], [30], [40], [50]],
    4: [[25], [35], [50], [65], [75]],
    5: [[50], [60], [70], [80], [100]],
  },
  12: {
    id: 12,
    daydream_name: "PieceUpVoAll",
    drop_type: "all blue",
    1: [],
    2: [],
    3: [],
    4: [],
    5: [[25], [35], [50], [65], [75]],
  },
  13: {
    id: 13,
    daydream_name: "PieceUpPfS",
    drop_type: "small yellow",
    1: [],
    2: [],
    3: [[10], [20], [30], [40], [50]],
    4: [[25], [35], [50], [65], [75]],
    5: [[50], [60], [70], [80], [100]],
  },
  14: {
    id: 14,
    daydream_name: "PieceUpPfM",
    drop_type: "medium yellow",
    1: [],
    2: [],
    3: [[10], [20], [30], [40], [50]],
    4: [[25], [35], [50], [65], [75]],
    5: [[50], [60], [70], [80], [100]],
  },
  15: {
    id: 15,
    daydream_name: "PieceUpPfL",
    drop_type: "large yellow",
    1: [],
    2: [],
    3: [[10], [20], [30], [40], [50]],
    4: [[25], [35], [50], [65], [75]],
    5: [[50], [60], [70], [80], [100]],
  },
  16: {
    id: 16,
    daydream_name: "PieceUpPfAll",
    drop_type: "all yellow",
    1: [],
    2: [],
    3: [],
    4: [],
    5: [[25], [35], [50], [65], [75]],
  },
  28: {
    id: 28,
    daydream_name: "PieceUpAllAll",
    drop_type: "all",
    1: [],
    2: [],
    3: [],
    4: [],
    5: [[25], [35], [50], [65], [75]],
  },
};

export { centerSkills, liveSkills, supportSkills };
