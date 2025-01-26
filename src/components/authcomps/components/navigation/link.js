import Link from "@mui/material/Link";

const LinkStyled = ({ action, title }) => {
  return (
    <Link
      style={{ cursor: "pointer" }}
      onClick={action}
      sx={{ alignSelf: "center" }}
    >
      {title}
    </Link>
  );
};

export default LinkStyled;
