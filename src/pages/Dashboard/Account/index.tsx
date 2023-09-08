import { Alert, AlertTitle, Grid, Paper } from "@mui/material";
import React from "react";

const Account: React.FC = () => {
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
    </Paper>
  );
};

export default Account;
