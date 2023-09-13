import { Role } from "@boardware/core-ts-sdk";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useState } from "react";
import accountApi from "../../../../../api/core";
import { sha256 } from "../../../../../utils/account";
import {
  passwordHelpText,
  validatePassword,
} from "../../../../../utils/password";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

export default function () {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [role, setRole] = useState<Role>(Role.User);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setPasswordError(passwordHelpText);
      return;
    }
    accountApi
      .createAccount({
        createAccountRequest: {
          email: email,
          password: sha256(password),
          role: role,
        },
      })
      .then(() => {
        enqueueSnackbar("Created!", { variant: "success" });
        nav("/dashboard/admin/users");
      })
      .catch(() => {
        setEmailError("Email exists.");
      });
  };
  return (
    <Paper style={{ padding: 20 }}>
      <Grid
        onSubmit={submit}
        component={"form"}
        direction={"column"}
        container
        spacing={2}>
        <Grid item>Create Account</Grid>
        <Grid item>
          <TextField
            error={emailError !== ""}
            helperText={emailError}
            size="small"
            value={email}
            type={"email"}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            fullWidth></TextField>
        </Grid>
        <Grid item>
          <TextField
            helperText={passwordError}
            error={passwordError !== ""}
            size="small"
            value={password}
            type={"password"}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            fullWidth></TextField>
        </Grid>
        <Grid item>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Role</FormLabel>
            <RadioGroup
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group">
              <FormControlLabel
                value={Role.User}
                control={<Radio />}
                label="User"
              />
              <FormControlLabel
                value={Role.Admin}
                control={<Radio />}
                label="Admin"
              />
              <FormControlLabel
                value={Role.Root}
                control={<Radio />}
                label="Root"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
