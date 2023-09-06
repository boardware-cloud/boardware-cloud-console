import { Alert, AlertTitle, Grid, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import accountApi from "../../../api/core";

const Account: React.FC = () => {
  const [email, setEmail] = useState("");
  useEffect(() => {
    accountApi.getAccount().then((account) => {
      setEmail(account.email);
    });
  }, []);
  return (
    <Paper sx={{ width: "100%", mb: 2 }} style={{ padding: 20 }}>
      <Grid direction="column" alignItems="center" container spacing={1}>
        <Grid item>Two-factor authentication</Grid>
        <Grid item>
          <Alert severity="info">
            <AlertTitle>
              Learn more about our two-factor authentication initiative.
            </AlertTitle>
          </Alert>
        </Grid>
      </Grid>
      {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="Password" value="password" />
        </Tabs>
        {tab === "password" && <Password show={true}></Password>}
      </Box> */}
    </Paper>
  );
};

export default Account;
