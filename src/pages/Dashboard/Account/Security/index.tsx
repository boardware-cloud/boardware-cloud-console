import { Grid, Paper } from "@mui/material";
import React from "react";
import ChangePassword from "./ChangePassword";
import TwoFactor from "./TwoFactor";

const Security: React.FC = () => {
  return (
    <Paper style={{ padding: 20 }}>
      <Grid direction={"column"} container spacing={2}>
        <Grid item>
          <ChangePassword></ChangePassword>
        </Grid>
        <Grid item>
          <TwoFactor />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Security;
