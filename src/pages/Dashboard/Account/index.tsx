import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Container,
  FilledInput,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import { message } from "antd";
import { VerificationCodePurpose } from "@boardware/core-ts-sdk";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import accountApi, { verificationApi } from "../../../api/core";
import { sha256 } from "../../../utils/account";
import { ResponseError } from "@boardware/argus-ts-sdk";

const Password: React.FC<{ show: boolean }> = ({ show }) => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  useEffect(() => {
    accountApi.getAccount().then((account) => {
      setEmail(account.email);
    });
  }, []);
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
      })
      .catch((err: ResponseError) => {
        err.response.json().then((j) => {
          messageApi.error(j.message);
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
      </Box>
    </Container>
  );
};

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
