const readXlsxFile = require("read-excel-file/node");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// const uuids = Array(1000)
//   .fill(0)
//   .map((id) => uuidv4());

let uuidss = {};
const data = fs.readFileSync("./src/app/admin/adminUtils/py/uuids.txt", "utf8");
data.split("\n").forEach((line) => {
  const id = line.split(";")[0];
  const uuid = line.split(";")[1];
  uuidss[id] = uuid;
});
console.log("initialState", uuidss["1"]);

readXlsxFile("./src/app/admin/adminUtils/chapters.xlsx").then((rows) => {
  let nodes = [];
  let edges = [];
  const nm = rows[0].reduce(
    (acc, header, id) => ({ ...acc, [header]: id }),
    {}
  );
  for (let i = 1; i < rows.length; i++) {
    const to = rows[i][nm["to"]];
    const id = uuidss[rows[i][nm["id"]]];
    const toEdges = !!to ? to.toString().split(";") : [];
    toEdges.forEach((edge) => {
      const edgeuuid = uuidss[edge];
      edges.push({
        id: `e${id}-${edgeuuid}`,
        source: id,
        target: edgeuuid,
      });
    });
    res = {
      id,
      position: { x: rows[i][nm["x"]], y: rows[i][nm["y"]] },
      type: "turbo",
      data: {
        id,
        title: rows[i][nm["title"]],
        subline: rows[i][nm["subline"]],
        // action: "action",
      },
    };
    nodes.push(res);
  }
  const fs = require("fs");
  ob1 =
    "export const chapterFlowNodes = " +
    JSON.stringify(nodes)
      .replace(/"([^"]+)":/g, "$1:")
      .replace(/\\\\/g, "\\") +
    "\n";
  ob2 =
    "export const chapterFlowEdges = " +
    JSON.stringify(edges)
      .replace(/"([^"]+)":/g, "$1:")
      .replace(/\\\\/g, "\\");

  // setDocInCollectionClient('chapters',);
  fs.writeFile(
    "./src/app/admin/adminUtils/chaptersFlowData.js",
    ob1 + ob2,
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    }
  );
});

// const etl = (line) => {
//   return !!line ? line.toString().split(";") : [];
// };
// readXlsxFile("./src/app/admin/adminUtils/tests.xlsx").then((rows) => {
//   let results = [];
//   const nm = rows[0].reduce(
//     (acc, header, id) => ({ ...acc, [header]: id }),
//     {}
//   );

//   for (let i = 1; i < rows.length; i++) {
//     res = {
//       // chapterid: rows[i][nm["chapterid"]],
//       chapterid: uuids[Number(rows[i][nm["chapterid"]])],
//       id: rows[i][nm["id"]],
//       task: rows[i][nm["task"]],
//       defaultinput: etl(rows[i][nm["defaultinput"]]) || "",
//       defaultoutput: etl(rows[i][nm["defaultoutput"]]) || "",
//       defaultcode: rows[i][nm["defaultcode"]],
//       rightcode: rows[i][nm["rightcode"]],
//       inout: [
//         {
//           inv: etl(rows[i][nm["in1"]]),
//           outv: etl(rows[i][nm["out1"]]),
//         },
//         {
//           inv: etl(rows[i][nm["in2"]]),
//           outv: etl(rows[i][nm["out2"]]),
//         },
//       ],
//       restrictions: {
//         maxlines: rows[i][nm["maxlines"]],
//         musthave: etl(rows[i][nm["musthave"]]),
//         musthaveRe: etl(rows[i][nm["musthavere"]]),
//         forbidden: etl(rows[i][nm["forbidden"]]),
//         forbiddenRe: etl(rows[i][nm["forbiddenre"]]),
//       },
//     };
//     results.push(res);
//   }
//   const fs = require("fs");

//   fs.writeFile(
//     "./src/app/admin/adminUtils/tasksData.js",
//     "export const testsall =" +
//       JSON.stringify(results)
//         .replace(/"([^"]+)":/g, "$1:")
//         .replace(/\\\\/g, "\\"),
//     function (err) {
//       if (err) {
//         return console.log(err);
//       }
//       console.log("The file was saved!");
//     }
//   );
// });
