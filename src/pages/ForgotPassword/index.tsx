import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  Button,
  IconButton,
  Grid,
  Link,
  FormHelperText,
} from "@mui/material";
import { VerificationCodePurpose } from "@boardware/core-ts-sdk";
import React, { useCallback, useEffect, useState } from "react";
import accountApi, { verificationApi } from "../../api/core";
import Copyright from "../../components/Copyright";
import { sha256 } from "../../utils/account";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { ResponseError } from "@boardware/argus-ts-sdk";
import CenterForm from "../../components/CenterForm";
import { passwordHelpText, validatePassword } from "../../utils/password";

const ForgotPassword: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [reciprocal, setReciprocal] = useState(0);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    if (validatePassword(password)) {
      setPasswordError("");
    }
  }, [password]);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const sendVerificationCode = useCallback(() => {
    verificationApi
      .createVerificationCode({
        createVerificationCodeRequest: {
          email: email,
          purpose: VerificationCodePurpose.SetPassword,
        },
      })
      .then(() => {
        setEmailError("");
        let r = 60;
        setReciprocal(r);
        const interval = setInterval(() => {
          setReciprocal(--r);
          if (r === 0) {
            clearInterval(interval);
          }
        }, 1000);
        messageApi.success("Sent");
      })
      .catch((e: ResponseError) => {
        e.response.json().then((err) => {
          setEmailError(err.message);
        });
      });
  }, [email]);
  const resetPasswordRequest = () => {
    if (!validatePassword(password)) {
      setPasswordError(passwordHelpText);
      return;
    }
    accountApi
      .updatePassword({
        updatePasswordRequest: {
          email: email,
          newPassword: sha256(password),
          verificationCode: verificationCode,
        },
      })
      .then(() => {
        messageApi.success("Password updated");
        nav("/signin");
      })
      .catch(() => {
        messageApi.error("Fail");
      });
  };
  return (
    <CenterForm>
      {contextHolder}
      <Box
        sx={{
          width: 350,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <img height="40" src="/boardware.png" />
        <Typography sx={{ mt: 2, mb: 2 }} component="h1" variant="h5">
          Forgot password
        </Typography>
        <FormControl
          error={emailError !== ""}
          fullWidth
          sx={{ m: 1 }}
          variant="filled">
          <InputLabel htmlFor="filled-adornment-password">Email</InputLabel>
          <FilledInput
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                sendVerificationCode();
              }
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="filled-adornment-password"
            type="email"
          />
          {emailError !== "" && <FormHelperText>{emailError}</FormHelperText>}
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
          <InputLabel htmlFor="filled-adornment-password">
            Verification Code
          </InputLabel>
          <FilledInput
            value={verificationCode}
            onChange={(e) => {
              if (e.target.value.length <= 6)
                setVerificationCode(e.target.value);
            }}
            id="filled-adornment-password"
            type="text"
            endAdornment={
              <InputAdornment position="end">
                <Button
                  onClick={sendVerificationCode}
                  disabled={reciprocal !== 0}
                  variant="contained">
                  {reciprocal === 0 ? "Verify" : reciprocal + "s"}
                </Button>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl
          error={passwordError !== ""}
          fullWidth
          sx={{ m: 1 }}
          variant="filled">
          <InputLabel htmlFor="filled-adornment-password">
            New Password
          </InputLabel>
          <FilledInput
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                resetPasswordRequest();
              }
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="filled-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {passwordError !== "" && (
            <FormHelperText>{passwordError}</FormHelperText>
          )}
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={resetPasswordRequest}
          sx={{ mt: 3, mb: 2 }}>
          Reset password
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="/signin" variant="body2">
              Have an account? Sign In
            </Link>
          </Grid>
        </Grid>
      </Box>
      <Copyright sx={{ mt: 4, mb: 4 }} />
    </CenterForm>
  );
};

export default ForgotPassword;
