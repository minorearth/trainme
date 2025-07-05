import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export const CustomLink = ({ action, title, text }) => {
  return (
    <Typography sx={{ textAlign: "center" }}>
      {text}
      <Link
        style={{ cursor: "pointer" }}
        onClick={action}
        sx={{ alignSelf: "center" }}
      >
        {title}
      </Link>
    </Typography>
  );
};
