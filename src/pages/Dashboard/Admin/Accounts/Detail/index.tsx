import { Account } from "@boardware/core-ts-sdk";
import { Grid, Paper, Skeleton, Typography } from "@mui/material";
import { useLoaderData, useNavigation } from "react-router-dom";

export default function () {
  const { account } = useLoaderData() as { account: Account };
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper style={{ padding: 20 }}>
          <Grid container>
            <Grid item>
              <Typography variant="h5" component="h3">
                Basic Information
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
