import local from "@/globals/local";

export const useColumns = ({ actions, mode }) => {
  let columns = [
    {
      field: "name",
      headerName: local.ru.gridcols.FILES_FILENAME,
      flex: 1,
      minwidth: 230,
    },
    {
      field: "id",
      headerName: "id",
      flex: 1,
      minwidth: 230,
    },
  ];

  return { columns };
};
