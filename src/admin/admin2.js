const readXlsxFile = require("read-excel-file/node");

const etl = (line) => {
  return !!line ? line.toString() : "";
};

readXlsxFile("./src/admin/chapters.xlsx").then((rows) => {
  let results = [];
  let edges = [];
  const nm = rows[0].reduce(
    (acc, header, id) => ({ ...acc, [header]: id }),
    {}
  );
  for (let i = 1; i < rows.length; i++) {
    const to = rows[i][nm["to"]];
    const id = rows[i][nm["id"]].toString();
    const toEdges = !!to ? to.toString().split(";") : [];
    toEdges.forEach((edge) => {
      edges.push({
        id: `e${id}-${edge}`,
        source: id,
        target: edge,
      });
    });
    res = {
      id,
      position: { x: rows[i][nm["x"]], y: rows[i][nm["y"]] },
      type: "turbo",
      data: {
        id: rows[i][nm["id"]].toString(),
        title: rows[i][nm["title"]],
        subline: rows[i][nm["subline"]],
        action: "action",
      },
    };
    results.push(res);
  }
  const fs = require("fs");
  ob1 =
    "export const initialNodes = (action) => {return" +
    JSON.stringify(results)
      .replace(/"([^"]+)":/g, "$1:")
      .replace(/\\\\/g, "\\")
      .replaceAll('"action"', "action") +
    "}\n";
  ob2 =
    "export const initialEdges = " +
    JSON.stringify(edges)
      .replace(/"([^"]+)":/g, "$1:")
      .replace(/\\\\/g, "\\");

  fs.writeFile("./src/admin/test.js", ob1 + ob2, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });

  console.log(edges);
});
