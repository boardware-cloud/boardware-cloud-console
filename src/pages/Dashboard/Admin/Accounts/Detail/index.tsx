import { Paper } from "@mui/material";
import { useParams } from "react-router-dom";

export default function () {
  const { id } = useParams();
  return <Paper>{id}</Paper>;
}
