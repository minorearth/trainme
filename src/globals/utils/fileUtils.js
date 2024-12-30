import JSZip from "jszip";
import mime from "mime-types";

export const extractFileExtension = (filename) => {
  return filename.includes(".") ? filename.split(".").pop() : false;
};

export const mimeExtension = (file) => {
  const fileExtension = mime.extension(file.type);
  return fileExtension;
};

export const fileExtension = (file) => {
  const mimeExt = mimeExtension(file);
  if (mimeExt) return mimeExt;
  const ext = extractFileExtension(file.name);
  return ext;
};

export const downloadUrls = async (urls) => {
  await Promise.all(
    urls.map(async (url) => await UrlToFile(url.url, url.filename))
  ).then((res) => {
    compressFiles(res, "allfiles.zip").then((file) => {
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = "allfiles.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  });
};
export const UrlToFile = async (imageBase64DataUrl, fileName) => {
  const preBlob = await fetch(imageBase64DataUrl);
  const blob = await preBlob.blob();
  const file = new File([blob], fileName, {
    type: blob.type,
  });
  return file;
};

export const compressFiles = async (files, filename) => {
  var zip = new JSZip();
  files.forEach((file) => zip.file(file.name, file));
  const fileZIPpedBlob = await zip.generateAsync({ type: "blob" });
  const fileZIPped = new File([fileZIPpedBlob], filename, {
    type: fileZIPpedBlob.type,
  });
  return fileZIPped;
};

function BufferToArrayBuffer(buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.data.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.data.length; ++i) {
    view[i] = buffer.data[i];
  }
  return arrayBuffer;
}

export function arrayBufferToBuffer(arrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}

export const fileToBuffer = async (file) => {
  const AB = await file.arrayBuffer();
  const buffer = arrayBufferToBuffer(AB);
  return buffer;
};

export const bufferToFile = (buffer, filename, filetype) => {
  const file = new File([BufferToArrayBuffer(buffer)], filename, {
    type: filetype,
  });
  return file;
};
