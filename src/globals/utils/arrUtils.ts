//confirm any
export const eqArrays = (a: any[], b: any[]) => {
  return (
    a.every((val, idx) => val === b[idx]) &&
    b.every((val, idx) => val === a[idx])
  );
};
