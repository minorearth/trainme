import mergeImages from "merge-images";

import "jimp";

export async function getImageDimensions(file) {
  return new Promise(function (resolved, rejected) {
    new Jimp(file, (err, image) => {
      resolved({ w: image.bitmap.width, h: image.bitmap.height });
    });
  });
}

export const Base64DataUrlToFile2 = async (imageBase64DataUrl, fileName) => {
  var arr = imageBase64DataUrl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

export const scaleToBase = (base, sDim) => {
  const scale = Number(Number(sDim.h / (sDim.w / base)).toFixed(0));
  if (sDim.w <= base) {
    return sDim;
  } else {
    return { w: base, h: scale };
  }
};

export const resizeImg = (base64Str, w, h) => {
  return new Promise(function (resolved, rejected) {
    Jimp.read(base64Str, (err, screenJimp) => {
      screenJimp.resize(w, h);
      screenJimp.getBase64(Jimp.AUTO, (err, res) => {
        resolved({ src: res, w, h });
      });
    });
  });
};

const prepareImages = (photos, log) => {
  let pos = 0;
  let maxW = 0;
  let logsArray = [];
  const allimg = photos.map((img) => {
    logsArray.push({ src: img.src.slice(0, 1000), x: 0, y: pos });
    const res = { src: img.src, x: 0, y: pos };
    pos += img.h;
    maxW = Math.max(img.w, maxW);
    return res;
  });

  return { images: allimg, totalH: pos, maxW };
};

export const prepareAndMergeImagesTob46URI = async (photos, log) => {
  const imagesPrepared = prepareImages(photos, log);
  const b64URI = await mergeImages(imagesPrepared.images, {
    height: imagesPrepared.totalH,
    width: imagesPrepared.maxW,
  });
  return { b64URI, h: imagesPrepared.totalH, w: imagesPrepared.maxW };
};

export function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

const prepareImages2 = async (files) => {
  const filesExtracted = await Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      return new Promise(function (resolved, rejected) {
        new Jimp(arrayBuffer, (err, image) => {
          const sDimResized = scaleToBase(640, {
            w: image.bitmap.width,
            h: image.bitmap.height,
          });
          image.resize(sDimResized.w, sDimResized.h);
          resolved({
            arrayBuffer: arrayBuffer,
            jimpimg: image,
            w: sDimResized.w,
            h: sDimResized.h,
          });
        });
      });
    })
  );
  const maxW = Math.max(...filesExtracted.map((img) => img.w));
  let pos = 0;
  const allimg = filesExtracted.map((img) => {
    const res = { ...img, y: pos };
    pos += img.h;
    return res;
  });
  return { images: allimg, totalH: pos, maxW };
};

export const rotateImage = async (file, filename) => {
  return new Promise(function (resolved, rejected) {
    new Jimp(file, (err, image) => {
      image.rotate(90);
      image.getBuffer(Jimp.AUTO, (err, res) => {
        const file = new File([res], filename, {
          type: "image/png",
        });
        resolved(file);
      });
    });
  });
};

export const getJimpFileByUrl = async (file, filename) => {
  return new Promise(function (resolved, rejected) {
    new Jimp(file, (err, image) => {
      try {
        image.getBuffer(Jimp.AUTO, (err, res) => {
          const file = new File([res], filename, {
            type: "image/jpeg",
          });
          resolved(file);
        });
      } catch (e) {
        throw rejected("get image error");
      }
    });
  });
};

export const mergeAllImages = async (files, filename) => {
  const filesPrepared = await prepareImages2(files);
  return new Promise(function (resolved, rejected) {
    new Jimp(
      filesPrepared.maxW,
      filesPrepared.totalH,
      "white",
      (err, image) => {
        filesPrepared.images.forEach((img) => {
          image.blit(img.jimpimg, 0, img.y);
        });
        // image.grayscale();
        image.quality(80);
        image.getBuffer("image/jpeg", (err, res) => {
          const file = new File([res], filename, {
            type: "image/jpeg",
          });
          resolved(file);
        });
      }
    );
  });
};
