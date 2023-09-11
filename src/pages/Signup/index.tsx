import {
  Avatar,
  Box,
  Button,
  FilledInput,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import accountApi, { verificationApi } from "../../api/core";
import { VerificationCodePurpose } from "@boardware/core-ts-sdk";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { sha256 } from "../../utils/account";
import { ResponseError } from "@boardware/argus-ts-sdk";
import CenterForm from "../../components/CenterForm";
import { passwordHelpText, validatePassword } from "../../utils/password";

const Signup: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [reciprocal, setReciprocal] = useState(0);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [messageApi, contextHolder] = message.useMessage();
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const sendVerificationCode = useCallback(() => {
    if (reciprocal !== 0) return;
    if (email === "") {
      setEmailError("Email are required");
      return;
    }
    verificationApi
      .createVerificationCode({
        createVerificationCodeRequest: {
          email: email,
          purpose: VerificationCodePurpose.CreateAccount,
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
      })
      .catch((e: ResponseError) => {
        e.response.json().then((err) => {
          setEmailError(err.message);
        });
      });
  }, [email]);
  const signupRequest = () => {
    if (!validatePassword(password)) {
      setPasswordError(true);
      return;
    }
    accountApi
      .createAccount({
        createAccountRequest: {
          email: email,
          password: sha256(password),
          verificationCode: verificationCode,
        },
      })
      .then(() => {
        messageApi.success("Success");
        nav("/signin");
      })
      .catch(() => {
        messageApi.error("Fail");
      });
  };
  return (
    <CenterForm>
      <Box
        sx={{
          width: 350,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <AccountBoxIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <FormControl
          error={emailError !== ""}
          fullWidth
          sx={{ m: 1 }}
          variant="filled">
          <InputLabel htmlFor="filled-adornment-password">Email</InputLabel>
          <FilledInput
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendVerificationCode();
              }
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="filled-adornment-password"
            type="email"
          />
          {emailError && <FormHelperText>{emailError}</FormHelperText>}
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
          error={passwordError}
          fullWidth
          sx={{ m: 1 }}
          variant="filled">
          <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
          <FilledInput
            error={passwordError}
            value={password}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                signupRequest();
              }
            }}
            onChange={(e) => {
              if (validatePassword(e.target.value)) setPasswordError(false);
              setPassword(e.target.value);
            }}
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
          {passwordError && <FormHelperText>{passwordHelpText}</FormHelperText>}
        </FormControl>
        <Button
          onClick={signupRequest}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}>
          Sign Up
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="/signin" variant="body2">
              Have an account? Sign In
            </Link>
          </Grid>
        </Grid>
      </Box>
    </CenterForm>
  );
};

export default Signup;
