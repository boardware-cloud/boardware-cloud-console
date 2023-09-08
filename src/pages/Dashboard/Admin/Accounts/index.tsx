import { Account } from "@boardware/core-ts-sdk";
import { Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import accountApi from "../../../../api/core";

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  useEffect(() => {
    accountApi
      .listAccount({ index: 0, limit: 100 })
      .then((accountList) => {
        setAccounts(accountList.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <Paper>
      {accounts.map((account, index) => {
        return <div key={index}>{account.email}</div>;
      })}
    </Paper>
  );
};

export default Accounts;
