import React, { useState, useMemo, ChangeEvent } from "react";

type CellValue = [string, string, number | string];
type TableData = { [state: number]: { [char: string]: string } };

const TuringMachineEditor: React.FC = () => {
  const [alphabetInput, setAlphabetInput] = useState<string>("_ 0 1");
  const [numStates, setNumStates] = useState<number>(2);
  const [tableData, setTableData] = useState<TableData>({});

  const alphabet = useMemo(
    () => alphabetInput.split(/\s+/).filter((s) => s !== ""),
    [alphabetInput],
  );

  const handleCellChange = (state: number, char: string, value: string) => {
    setTableData((prev) => ({
      ...prev,
      [state]: { ...prev[state], [char]: value },
    }));
  };

  const program = useMemo(() => {
    const prog: { [char: string]: any[] } = {};

    alphabet.forEach((char) => {
      prog[char] = [];
      for (let s = 0; s < numStates; s++) {
        const val = tableData[s]?.[char] || "";
        const parts = val.split(",").map((p) => p.trim());

        if (parts.length === 3) {
          prog[char][s] = [
            parts[0],
            parts[1],
            isNaN(Number(parts[2])) ? parts[2] : Number(parts[2]),
          ];
        } else {
          prog[char][s] = [];
        }
      }
    });
    return prog;
  }, [alphabet, numStates, tableData]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "20px" }}>
        <label>Алфавит (через пробел): </label>
        <input
          value={alphabetInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAlphabetInput(e.target.value)
          }
        />
        <br />
        <br />
        <label>Кол-во состояний: </label>
        <input
          type="number"
          value={numStates}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNumStates(Math.max(1, parseInt(e.target.value) || 0))
          }
        />
      </div>

      <table
        border={1}
        style={{ borderCollapse: "collapse", marginBottom: "20px" }}
      >
        <thead>
          <tr>
            <th>Q \ Σ</th>
            {alphabet.map((char) => (
              <th key={char} style={{ padding: "10px" }}>
                {char}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: numStates }).map((_, s) => (
            <tr key={s}>
              <td style={{ fontWeight: "bold", padding: "10px" }}>q{s}</td>
              {alphabet.map((char) => (
                <td key={char}>
                  <input
                    style={{
                      width: "80px",
                      textAlign: "center",
                      border: "none",
                    }}
                    placeholder="0,R,1"
                    value={tableData[s]?.[char] || ""}
                    onChange={(e) => handleCellChange(s, char, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Итоговая программа (JSON):</h3>
      <pre
        style={{ background: "#f4f4f4", padding: "15px", borderRadius: "5px" }}
      >
        {JSON.stringify(program, null, 2)}
      </pre>
    </div>
  );
};

export default TuringMachineEditor;
