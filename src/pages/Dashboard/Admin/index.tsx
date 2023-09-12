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
      if (account.role !== Role.Root) {
        nav("/dashboard");
      }
    });
  });
  return <Accounts></Accounts>;
};

export default Admin;
