const readXlsxFile = require("read-excel-file/node");
const { v4: uuidv4 } = require("uuid");

const uuids = Array(1000)
  .fill(0)
  .map((id) => uuidv4());

console.log("initialState", uuids[1]);

const etl = (line) => {
  return !!line ? line.toString() : "";
};

readXlsxFile("./src/app/admin/adminUtils/chapters.xlsx").then((rows) => {
  let nodes = [];
  let edges = [];
  const nm = rows[0].reduce(
    (acc, header, id) => ({ ...acc, [header]: id }),
    {}
  );
  for (let i = 1; i < rows.length; i++) {
    const to = rows[i][nm["to"]];
    const id = uuids[Number(rows[i][nm["id"]])];
    const toEdges = !!to ? to.toString().split(";") : [];
    toEdges.forEach((edge) => {
      const edgeuuid = uuids[Number(edge)];
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

readXlsxFile("./src/app/admin/adminUtils/tests.xlsx").then((rows) => {
  let results = [];
  const nm = rows[0].reduce(
    (acc, header, id) => ({ ...acc, [header]: id }),
    {}
  );

  for (let i = 1; i < rows.length; i++) {
    res = {
      // chapterid: rows[i][nm["chapterid"]],
      chapterid: uuids[Number(rows[i][nm["chapterid"]])],
      id: rows[i][nm["id"]],
      task: rows[i][nm["task"]],
      defaultinput: etl(rows[i][nm["defaultinput"]]).split(";") || "",
      defaultoutput: etl(rows[i][nm["defaultoutput"]]).split(";") || "",
      defaultcode: etl(rows[i][nm["defaultcode"]]),
      rightcode: etl(rows[i][nm["rightcode"]]),
      inout: [
        {
          inv: etl(rows[i][nm["in1"]]).split(";"),
          outv: etl(rows[i][nm["out1"]]).split(";"),
        },
        {
          inv: etl(rows[i][nm["in2"]]).split(";"),
          outv: etl(rows[i][nm["out2"]]).split(";"),
        },
      ],
      restrictions: {
        maxlines: rows[i][nm["maxlines"]],
        musthave: etl(rows[i][nm["musthave"]]).split(";"),
      },
    };
    results.push(res);
  }
  const fs = require("fs");

  fs.writeFile(
    "./src/app/admin/adminUtils/tasksData.js",
    "export const testsall =" +
      JSON.stringify(results)
        .replace(/"([^"]+)":/g, "$1:")
        .replace(/\\\\/g, "\\"),
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    }
  );
});