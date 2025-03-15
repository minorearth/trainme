export const ObjtoArr = (obj) => {
  return !obj
    ? []
    : Object.keys(obj).map((key) => {
        return {
          ...obj[key],
        };
      });
};

export const flipObject = (obj) => {
  const ret = {};
  Object.keys(obj).forEach((key) => {
    ret[obj[key]] = key;
  });
  return ret;
};

export const getSubKeyValues = (obj, subkey) => {
  return Object.keys(obj).map((key) => obj[key]);
};

export const getKeyBySubKeyValue = (obj, subkey, value) => {
  return Object.keys(obj).filter((key) => obj[key][subkey] == value)[0];
};
