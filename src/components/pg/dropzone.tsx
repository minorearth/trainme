import React, { useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useMemo, useState, useEffect } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { observer } from "mobx-react-lite";
import mime from "mime-types";

import unit from "@/components/unitset/unitrun/layers/store/unit";

const baseStyle: React.CSSProperties = {
  display: "flex",
  height: "160px",
  width: "500px",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  alignContent: "center",
  padding: "20px",
  marginTop: "10px",
  marginRight: "15px",
  borderWidth: 2,
  borderRadius: 5,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

export const mimeExtension = (file: FileWithPath) => {
  const fileExtension = mime.extension(file.type);
  return fileExtension;
};

export const fileExtension = (file: FileWithPath) => {
  const mimeExt = mimeExtension(file);
  if (mimeExt) return mimeExt;
  const ext = extractFileExtension(file.name);
  return ext;
};

export const extractFileExtension = (filename: string) => {
  return filename.includes(".") ? filename.split(".").pop() : false;
};

type LoadedFile = {
  file: FileWithPath;
  text: string;
};

const getFilesData = (results: { file: FileWithPath; text: string }[]) => {
  let filesdata: string[] = [];
  results.forEach((result) => {
    filesdata.push(
      `f=open("${result.file.name}", 'w')\nf.write(${JSON.stringify(result.text)})\nf.close()\n`,
    );
  });
  return filesdata.join("\\n");
};

const DropZone = observer(() => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  // const [texts, setTexts] = useState<LoadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    // сохраняем сами файлы
    setFiles((prev) => [...prev, ...acceptedFiles]);

    const readText = (f: FileWithPath): Promise<LoadedFile> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ file: f, text: String(reader.result) });
        reader.onerror = () => reject(reader.error);
        reader.readAsText(f);
      });

    Promise.all(acceptedFiles.map((f) => readText(f)))
      .then((results) => {
        const filesData = getFilesData(results);
        console.log("results", filesData);

        unit.editors[0].filedata = filesData;
        // setTexts((prev) => [...prev, ...results]);
      })
      .catch((err) => {
        console.error("Ошибка чтения файлов:", err);
      });
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      accept: {
        "text/plain": [".txt"],
      },
      multiple: true,
      maxSize: 10 * 1024 * 1024,
      onDrop,
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  return (
    <Box {...getRootProps({ style })}>
      <input {...getInputProps()} />
      <CloudUploadIcon sx={{ fontSize: 30, alignSelf: "center" }} />
      <Typography variant="body1" gutterBottom style={{ textAlign: "center" }}>
        {`Перетащите сюда файлы или нажмите`}
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        style={{ textAlign: "center", fontSize: "medium" }}
      >
        {" Максимальный размер - 10 мб"}
      </Typography>
      <List dense={true}>
        {files.map((file, id) => (
          <span key={id}>
            {/* <ListItemIcon>
              <UploadFileIcon />
            </ListItemIcon> */}
            {`${file.name} `}
            {/* {`${file.name} - ${file.size} ${"байт"}`} */}
          </span>
        ))}
      </List>
    </Box>
  );
});

export default DropZone;
