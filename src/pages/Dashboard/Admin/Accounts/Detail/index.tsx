import { Account } from "@boardware/core-ts-sdk";
import { Paper } from "@mui/material";
import { useState } from "react";
import { useParams, useRouteLoaderData } from "react-router-dom";

export default function () {
  const { id } = useParams();
  const [account, setAccount] = useState<Account>();

  const user = useRouteLoaderData("root");

  return <Paper style={{ padding: 20 }}>{id}</Paper>;
}
