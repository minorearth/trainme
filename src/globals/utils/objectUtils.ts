//confirm any
export const ObjtoArr = (obj: { [key: string]: any }) => {
  return !obj
    ? []
    : Object.keys(obj).map((key) => {
        return {
          ...obj[key],
        };
      });
};

//confirm any
export const flipObject = (obj: { [key: string]: any }) => {
  const ret: { [key: string]: any } = {};
  Object.keys(obj).forEach((key) => {
    ret[obj[key]] = key;
  });
  return ret;
};

//confirm any
export const getKeyValues = (obj: { [key: string]: any }) => {
  return Object.keys(obj).map((key) => obj[key]);
};

//confirm any
export const getKeyBySubKeyValue = (
  obj: { [key: string]: any },
  subkey: string,
  value: any
) => {
  return Object.keys(obj).filter((key) => obj[key][subkey] == value)[0];
};
