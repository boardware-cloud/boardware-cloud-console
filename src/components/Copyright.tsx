import Link from "@mui/material/Link/Link";
import Typography from "@mui/material/Typography/Typography";

export default function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://www.boardware.com/">
        Boardware Cloud
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}
