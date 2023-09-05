import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Container,
  Box,
  Avatar,
  Typography,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  Button,
  IconButton,
  Grid,
  Link,
} from "@mui/material";
import { VerificationCodePurpose } from "core-ts-sdk";
import React, { useCallback, useState } from "react";
import accountApi, { verificationApi } from "../../api/core";
import Copyright from "../../components/Copyright";
import LockResetIcon from "@mui/icons-material/LockReset";
import { sha256 } from "../../utils/account";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { ResponseError } from "argus-ts-sdk";

const ForgotPassword: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [reciprocal, setReciprocal] = useState(0);
  const [password, setPassword] = useState("");
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
    verificationApi
      .createVerificationCode({
        createVerificationCodeRequest: {
          email: email,
          purpose: VerificationCodePurpose.SetPassword,
        },
      })
      .then(() => {
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
          messageApi.error(err.message);
        });
      });
  }, [email]);
  const resetPasswordRequest = () => {
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
    <Container component="main" maxWidth="xs">
      {contextHolder}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockResetIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot password
        </Typography>
        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
          <InputLabel htmlFor="filled-adornment-password">Email</InputLabel>
          <FilledInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="filled-adornment-password"
            type="email"
          />
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
        <FormControl fullWidth sx={{ m: 1 }} variant="filled">
          <InputLabel htmlFor="filled-adornment-password">
            New Password
          </InputLabel>
          <FilledInput
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
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
};

export default ForgotPassword;
