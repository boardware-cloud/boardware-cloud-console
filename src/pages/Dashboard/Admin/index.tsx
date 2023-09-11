import React, { useEffect } from "react";
import accountApi from "../../../api/core";
import { Role } from "@boardware/core-ts-sdk";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import Accounts from "./Accounts";

const Admin: React.FC = () => {
  const nav = useNavigate();
  useEffect(() => {
    accountApi.getAccount().then((account) => {
      console.log(account);
      if (account.role !== Role.Root) {
        nav("/dashboard");
      }
    });
  });
  return (
    <Paper style={{ padding: 20 }}>
      {/* <Button variant="contained"></Button> */}
      <Accounts></Accounts>
    </Paper>
  );
};

export default Admin;
