import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Password from "../../../../components/Password";
import accountApi from "../../../../api/core";
import { Account } from "core-ts-sdk";
import { QRCode } from "antd";
import { useNavigate } from "react-router-dom";

const Finish: React.FC = () => {
  const nav = useNavigate();
  return (
    <Grid direction="column" alignItems="center" container spacing={1}>
      <Grid item>
        <Alert severity="success">
          <AlertTitle>
            You have enabled two-factor authentication using your authenticator
            app.
          </AlertTitle>
        </Alert>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={() => nav("/dashboard/account")}>
          Done
        </Button>
      </Grid>
    </Grid>
  );
};

const SaveSecret: React.FC<{
  url: string;
  tokens: string[];
  success: () => void;
}> = ({ url, tokens, success }) => {
  const [codeError, setCodeError] = useState(false);
  const [totp, setTotp] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const secret = useMemo(() => {
    if (url) {
      const s = url.split("=");
      if (s.length === 0) {
        return "";
      }
      return s[s.length - 1];
    }
    return "";
  }, [url]);
  const updateTotp = () => {
    accountApi
      .createTotp2FA({
        putTotpRequest: { url, totpCode: totp, tickets: tokens },
      })
      .then(() => {
        success();
      })
      .catch(() => setCodeError(true));
  };
  const handleClick = () => navigator.clipboard.writeText(secret);

  return (
    <Paper style={{ width: 550, padding: 20 }}>
      <Dialog
        open={showSecret}
        onClose={() => setShowSecret(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          Your two-factor secret
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Button onClick={handleClick}>{secret}</Button>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Grid container spacing={1}>
        <Grid item>
          <Typography variant="h6" component={"h3"}>
            Setup authenticator app
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">
            Authenticator apps and browser extensions like{" "}
            <a
              target="_blank"
              href="https://support.1password.com/one-time-passwords/">
              1Password
            </a>
            ,{" "}
            <a target="_blank" href="https://authy.com/guides/github/">
              Authy
            </a>
            ,{" "}
            <a
              target="_blank"
              href="https://www.microsoft.com/en-us/security/mobile-authenticator-app">
              Microsoft Authenticator
            </a>
            , etc. generate one-time passwords that are used as a second factor
            to verify your identity when prompted during sign-in.
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" component={"h3"}>
            Scan the QR code
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">
            Use an authenticator app or browser extension to scan.{" "}
            <a
              target="_blank"
              href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication">
              Learn more about enabling 2FA.
            </a>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <QRCode value={url}></QRCode>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">
            Unable to scan? You can use the
            <Button onClick={() => setShowSecret(true)} variant="text">
              setup key.
            </Button>
            to manually configure your authenticator app.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" component={"h3"}>
            Verify the code from the app
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateTotp();
              }
            }}
            error={codeError}
            value={totp}
            onChange={(e) => setTotp(e.target.value)}
            size="small"
            label="XXX XXX"
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={updateTotp} variant="contained">
            Next
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

const Totp: React.FC = () => {
  const [account, setAccount] = useState<Account>();
  const [tokens, setTokens] = useState<string[]>([]);
  const [totpUrl, setTotpUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const getTotpUrl = () => {
    accountApi.getTotp().then((totp) => {
      setTotpUrl(totp.url);
    });
  };
  const step = useMemo(() => {
    if (success) {
      return 2;
    }
    if (tokens.length >= 1) {
      return 1;
    }
    return 0;
  }, [tokens, success]);
  useEffect(() => {
    accountApi.getAccount().then((account) => setAccount(account));
  }, []);
  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <Typography variant="h5" gutterBottom>
          Enable two-factor authentication (2FA)
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Stepper activeStep={step}>
          <Step completed={step !== 0}>
            <StepLabel>Authentication</StepLabel>
          </Step>
          <Step completed={step >= 2}>
            <StepLabel>Save Secret</StepLabel>
          </Step>
          <Step>
            <StepLabel>Finish</StepLabel>
          </Step>
        </Stepper>
      </Grid>
      <Grid item>
        {step === 0 && (
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="subtitle1" component="h3">
                Confirm password to continue
              </Typography>
            </Grid>
            <Grid item>
              <Paper>
                {account && (
                  <Password
                    success={(token) => {
                      getTotpUrl();
                      setTokens([...tokens, token]);
                    }}
                    email={account.email}></Password>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
        {step === 1 && (
          <SaveSecret
            success={() => {
              setSuccess(true);
            }}
            tokens={tokens}
            url={totpUrl}></SaveSecret>
        )}
        {step === 2 && <Finish></Finish>}
      </Grid>
    </Grid>
  );
};

export default Totp;
