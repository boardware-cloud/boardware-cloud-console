import { Grid, Paper } from "@mui/material";
import React, { useMemo } from "react";
import InfoTable from "../../../../components/InfoTable";
import { useLoaderData } from "react-router-dom";
import { Account } from "@boardware/core-ts-sdk";
import RoleTag from "../../../../components/RoleTag";

function Label(label: string) {
  return <label>{label}</label>;
}

export default function Info() {
  const { account } = useLoaderData() as { account: Account };
  const infos = useMemo(() => {
    return [
      { left: Label("Email"), right: account.email },
      { left: Label("Account ID"), right: account.id },
      {
        left: Label("Registered On"),
        right: new Date(account.registeredOn * 1000).toLocaleDateString(),
      },
      {
        left: Label("Role"),
        right: RoleTag(account.role),
      },
    ];
  }, [account]);
  return (
    <Grid container direction={"column"} spacing={2}>
      <Grid item>
        <Paper style={{ padding: 20 }}>
          <InfoTable title="Basic Information" items={infos}></InfoTable>
        </Paper>
      </Grid>
    </Grid>
  );
}
