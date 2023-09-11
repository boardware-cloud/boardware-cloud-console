import { TextField, Grid, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import SectionTitle from "../../../../components/SectionTitle";
import accountApi from "../../../../api/core";
import { sha256 } from "../../../../utils/account";
import { onEnter } from "../../../../utils/keyboard";
import { passwordHelpText, validatePassword } from "../../../../utils/password";

const ChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState(false);
  useEffect(() => {
    if (validatePassword(newPassword)) {
      setNewPasswordError("");
    }
  }, [newPassword]);
  const updatePassword = () => {
    if (!validatePassword(newPassword)) {
      setNewPasswordError(passwordHelpText);
      return;
    }
    if (newPassword !== confirmPassword || !newPassword) {
      setConfirmError(true);
      return;
    }
    accountApi
      .getAccount()
      .then((account) => {
        return accountApi.updatePassword({
          updatePasswordRequest: {
            email: account.email,
            password: sha256(oldPassword),
            newPassword: sha256(newPassword),
          },
        });
      })
      .then(() => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setConfirmError(false);
        setOldPasswordError(false);
      })
      .catch(() => {
        setOldPasswordError(true);
      });
  };
  return (
    <Grid direction={"column"} container spacing={2}>
      <Grid item>
        <SectionTitle title={"Change password"}></SectionTitle>
      </Grid>
      <Grid item>
        <TextField
          size="small"
          onKeyDown={onEnter(() => {
            updatePassword();
          })}
          style={{ width: 360 }}
          error={oldPasswordError}
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          label="Old password"
          helperText={oldPasswordError ? "Wrong password" : ""}></TextField>
      </Grid>
      <Grid item>
        <TextField
          onKeyDown={onEnter(() => {
            updatePassword();
          })}
          helperText={newPasswordError}
          error={newPasswordError !== ""}
          style={{ width: 360 }}
          size="small"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          label="New password"></TextField>
      </Grid>
      <Grid item>
        <TextField
          size="small"
          style={{ width: 360 }}
          error={confirmError}
          type="password"
          onKeyDown={onEnter(() => {
            updatePassword();
          })}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Confirm new password"></TextField>
      </Grid>
      <Grid item>
        <Button
          onClick={updatePassword}
          variant="contained"
          style={{ marginRight: 10 }}>
          Update password
        </Button>
        {/* <Button>I forgot my password</Button> */}
      </Grid>
    </Grid>
  );
};

export default ChangePassword;
