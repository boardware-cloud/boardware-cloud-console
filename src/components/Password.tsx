import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import React from "react";
import { ticketApi } from "../api/core";
import { sha256 } from "../utils/account";

interface IProps {
  email: string;
  success?: (token: string) => void;
}

//Wrong password. Try again or click Forgot password to reset it.
const Password: React.FC<IProps> = ({ email, success }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const confirmPassword = () => {
    ticketApi
      .createTicket({
        createTicketRequest: {
          email: email,
          type: "PASSWORD",
          password: sha256(password),
        },
      })
      .then((ticket) => {
        if (!success) return;
        success(ticket.token!);
        setPasswordError(false);
      })
      .catch(() => {
        setPasswordError(true);
      });
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div style={{ width: 300, padding: 20 }}>
      <FormControl
        error={passwordError}
        fullWidth
        style={{ marginBottom: 20 }}
        variant="standard">
        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
        <Input
          autoFocus
          value={password}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              confirmPassword();
            }
          }}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          id="standard-adornment-password"
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText id="outlined-weight-helper-text">
          {passwordError &&
            "Wrong password. Try again or click Forgot password to reset it."}
        </FormHelperText>
      </FormControl>
      <Button onClick={confirmPassword} fullWidth variant="contained">
        Confirm password
      </Button>
    </div>
  );
};

export default Password;
