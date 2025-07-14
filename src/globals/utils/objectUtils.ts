export const ObjtoArr = (obj: { [key: string]: any }) => {
  return !obj
    ? []
    : Object.keys(obj).map((key) => {
        return {
          ...obj[key],
        };
      });
};

export const flipObject = (obj: { [key: string]: any }) => {
  const ret: { [key: string]: any } = {};
  Object.keys(obj).forEach((key) => {
    ret[obj[key]] = key;
  });
  return ret;
};

export const getKeyValues = (obj: { [key: string]: any }) => {
  return Object.keys(obj).map((key) => obj[key]);
};

export const getKeyBySubKeyValue = (
  obj: { [key: string]: any },
  subkey: string,
  value: any
) => {
  return Object.keys(obj).filter((key) => obj[key][subkey] == value)[0];
};
