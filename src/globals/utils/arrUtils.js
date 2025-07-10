export const eqArrays = (a, b) => {
  return (
    a.every((val, idx) => val === b[idx]) &&
    b.every((val, idx) => val === a[idx])
  );
};
