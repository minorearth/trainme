const readXlsxFile = require("read-excel-file/node");

const etl = (line) => {
  return !!line ? line.toString() : "";
};

readXlsxFile("./src/admin/tests.xlsx").then((rows) => {
  // `rows[i]` is an array of rows[i]
  // each row being an array of cells.

  // f=[el.strip() for el in f]
  let results = [];
  const nm = rows[0].reduce(
    (acc, header, id) => ({ ...acc, [header]: id }),
    {}
  );

  for (let i = 1; i < rows.length; i++) {
    res = {
      chapterid: rows[i][nm["chapterid"]],
      id: rows[i][nm["id"]],
      task: rows[i][nm["task"]],
      defaultinput: etl(rows[i][nm["defaultinput"]]).split(";") || "",
      defaultoutput: etl(rows[i][nm["defaultoutput"]]).split(";") || "",
      defaultcode: etl(rows[i][nm["defaultcode"]]),
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
    "./src/admin/test.js",
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
