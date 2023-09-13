import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { sha256 } from "../../utils/account";
import Copyright from "../../components/Copyright";
import { message } from "antd";
import { ResponseError } from "@boardware/argus-ts-sdk";
import accountApi, { ticketApi } from "../../api/core";
import { Alert, Chip, FormHelperText } from "@mui/material";
import VerificationCodeButton from "../../components/VerificationCodeButton";
import {
  Ticket,
  TicketType,
  VerificationCodePurpose,
} from "@boardware/core-ts-sdk";
import { webauthnTicket } from "../../utils/webauthn";
import CenterForm from "../../components/CenterForm";
import EmailIcon from "@mui/icons-material/Email";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import KeyboardCapslockIcon from "@mui/icons-material/KeyboardCapslock";

enum Stage {
  EMAIL,
  PASSWORD,
  VERIFICATION_CODE,
  TOTP,
}

const Methods: React.FC<{ factors: string[]; stage: Stage }> = ({
  factors,
}) => {
  return (
    <ul>
      {factors.map((factor) => {
        switch (factor) {
          case "PASSWORD":
            return <li>Use Password</li>;
          case "EMAIL":
            return <li>Use email</li>;
          case "WEBAUTHN":
            return <li>Use Security key</li>;
          case "TOTP":
            return <li>Use Time-base one time password</li>;
        }
      })}
    </ul>
  );
};

export default function SignIn() {
  const [messageApi, contextHolder] = message.useMessage();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [factors, setFactors] = React.useState<string[]>([]);
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  const [stage, setStage] = React.useState<Stage>(Stage.EMAIL);
  const [verificationCode, setVerificationCode] = React.useState("");
  const [totpCode, setTotpCode] = React.useState("");
  const [formLoading, setFormLoading] = React.useState(false);
  const [totpError, setTotpError] = React.useState(false);
  const [loadingWebauthn, setLoadingWebauthn] = React.useState(false);
  const [capslock, setCapslock] = React.useState(false);
  React.useEffect(() => {
    setFormLoading(loadingWebauthn);
  }, [loadingWebauthn]);
  const hasTotp = React.useMemo(() => {
    return factors.findIndex((fa) => fa === "TOTP") !== -1;
  }, [factors]);

  React.useEffect(() => {
    if (tickets.length == 1) {
      if (hasTotp) {
        setStage(Stage.TOTP);
      } else {
        setStage(Stage.VERIFICATION_CODE);
      }
    }
    if (tickets.length == 2) {
      setFormLoading(true);
      setTimeout(() => {
        accountApi
          .createSession({
            createSessionRequest: {
              email: email,
              tickets: tickets.map((ticket) => ticket.token),
            },
          })
          .then((token) => {
            localStorage.setItem("token", token.secret);
            setTimeout(() => {
              window.location.href = "/dashboard/uptime";
            }, 250);
          })
          .catch((e: ResponseError) => {
            e.response.json().then((j) => {
              messageApi.error(j.message);
            });
          });
      }, 1000);
    }
  }, [tickets, hasTotp]);

  React.useEffect(() => {
    if (totpCode.length !== 6) return;
    totpSignin();
  }, [totpCode]);

  const getFactors = () => {
    if (formLoading) return;
    setFormLoading(true);
    if (!email) {
      setEmailError(true);
      messageApi.error("Email are required!");
      setFormLoading(false);
      return;
    }
    accountApi
      .getAuthentication({ email: email })
      .then((auth) => {
        setStage(Stage.PASSWORD);
        setFactors(auth.factors);
      })
      .catch(() => {
        setEmailError(true);
        messageApi.error("Email not found!");
      })
      .finally(() => setFormLoading(false));
  };
  const getVerificationCodeTicket = () => {
    ticketApi
      .createTicket({
        createTicketRequest: {
          email: email,
          type: TicketType.Email,
          verificationCode: verificationCode,
        },
      })
      .then((ticket) => {
        setTickets((tickets) => [...tickets, ticket]);
      })
      .catch(() => {
        alert("Verification error");
      });
  };
  const verificationPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formLoading) return;
    setFormLoading(true);
    if (!password) {
      setPasswordError(true);
      messageApi.error("Password are required!");
      setFormLoading(false);
      return;
    }
    ticketApi
      .createTicket({
        createTicketRequest: {
          email: email,
          type: TicketType.Password,
          password: sha256(password),
        },
      })
      .then((ticket) => {
        setTickets((tickets) => [...tickets, ticket]);
      })
      .catch((e: ResponseError) => {
        const statusCode = e.response.status;
        if (statusCode === 401) {
          setPasswordError(true);
        }
      })
      .finally(() => {
        setFormLoading(false);
      });
  };
  const totpSignin = () => {
    if (formLoading) return;
    if (!totpCode) {
      setTotpError(true);
      messageApi.error("One-time password are required!");
      return;
    }
    setFormLoading(true);
    ticketApi
      .createTicket({
        createTicketRequest: {
          email: email,
          type: TicketType.Totp,
          totpCode: totpCode,
        },
      })
      .then((ticket) => {
        setTickets((tickets) => [...tickets, ticket]);
      })
      .catch(() => {
        setTotpError(true);
      })
      .finally(() => {
        setFormLoading(false);
      });
  };

  const securityButton = () => {
    return (
      <Button
        disabled={loadingWebauthn}
        startIcon={<FingerprintIcon></FingerprintIcon>}
        onClick={() => {
          setLoadingWebauthn(true);
          webauthnTicket(email)
            .then((ticket: any) =>
              setTickets((tickets) => [...tickets, ticket])
            )
            .catch((e) => {
              console.log(e);
            })
            .finally(() => {
              setLoadingWebauthn(false);
            });
        }}>
        Use security key
      </Button>
    );
  };

  return (
    <CenterForm loading={formLoading}>
      {contextHolder}
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Grid container direction="column" alignItems="center" spacing={1}>
          <Grid item>
            <img height="40" src="/boardware.png" />
          </Grid>
          <Grid item>
            <Typography
              hidden={stage !== Stage.EMAIL}
              component="h1"
              variant="h5">
              Sign in
            </Typography>
            <Typography
              hidden={stage === Stage.EMAIL}
              component="h1"
              variant="h5">
              Welcome
            </Typography>
          </Grid>
          <Grid item>
            {stage !== Stage.EMAIL && (
              <Chip
                onDelete={() => {
                  setStage(Stage.EMAIL);
                  setTickets([]);
                  setPassword("");
                }}
                label={email}></Chip>
            )}
          </Grid>
          <Grid item>
            <Typography
              hidden={stage !== Stage.EMAIL}
              component="h2"
              variant="subtitle1">
              Use your Email
            </Typography>
          </Grid>
        </Grid>
        {stage === Stage.EMAIL && (
          <Box component="div" sx={{ mt: 1 }}>
            <TextField
              value={email}
              error={emailError}
              onChange={(e) => {
                setEmailError(false);
                setEmail(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") getFactors();
              }}
              fullWidth
              id="email"
              label="Email"
              autoComplete="email"
              autoFocus
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={getFactors}
              sx={{ mt: 2, mb: 2 }}>
              Next
            </Button>
            <Grid container>
              <Grid item xs={12}>
                <Link href="/forgotPassword" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        )}

        {stage === Stage.PASSWORD && (
          <Box component="form" onSubmit={verificationPassword} noValidate>
            <TextField
              helperText={capslock ? "Caps Lock IS ENABLED" : ""}
              onKeyDown={(e) => setCapslock(e.getModifierState("CapsLock"))}
              error={passwordError}
              onChange={(e) => {
                setPasswordError(false);
                setPassword(e.target.value);
              }}
              autoFocus
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}>
              Next
            </Button>
          </Box>
        )}
        {stage === Stage.VERIFICATION_CODE && (
          <Box component="div" style={{ maxWidth: 400 }} sx={{ mt: 1 }}>
            <Grid container direction="column" alignItems="center" spacing={1}>
              <Grid item>
                <Typography component="h1" variant="h5">
                  2FA - Email
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  To help keep your account safe, BoardWare wants to make sure
                  it’s really you trying to sign in
                </Alert>
                <VerificationCodeButton
                  autoSubmitAt={6}
                  onEnter={getVerificationCodeTicket}
                  setCode={setVerificationCode}
                  code={verificationCode}
                  onFrequent={() => alert("Please try again in 60 seconds!")}
                  purpose={VerificationCodePurpose.Ticket}
                  email={email}></VerificationCodeButton>
                <Button
                  onClick={getVerificationCodeTicket}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                  Sign In
                </Button>
              </Grid>
              {hasTotp && (
                <Grid item>
                  <Button
                    startIcon={<SmartphoneIcon></SmartphoneIcon>}
                    onClick={() => setStage(Stage.TOTP)}>
                    Use TOTP One-time password
                  </Button>
                </Grid>
              )}
              {factors.filter((factor) => factor === "WEBAUTHN").length !==
                0 && <Grid item>{securityButton()}</Grid>}
            </Grid>
          </Box>
        )}
        {stage === Stage.TOTP && (
          <Box
            component="div"
            style={{ alignContent: "center" }}
            sx={{ mt: 1 }}>
            <Grid container direction="column" alignItems="center" spacing={1}>
              <Grid item>
                <Typography component="h1" variant="h5">
                  2FA - TOTP
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  value={totpCode}
                  error={totpError}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      totpSignin();
                    }
                  }}
                  onChange={(e) => {
                    setTotpError(false);
                    setTotpCode(e.target.value);
                  }}
                  autoFocus
                  margin="normal"
                  label="One-time password"
                  fullWidth
                  autoComplete="current-password"
                />
                <Button
                  onClick={totpSignin}
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}>
                  Sign In
                </Button>
              </Grid>
              <Grid item>
                <Button
                  startIcon={<EmailIcon></EmailIcon>}
                  onClick={() => setStage(Stage.VERIFICATION_CODE)}>
                  Use Email Verification code
                </Button>
              </Grid>
              {factors.filter((factor) => factor === "WEBAUTHN").length !==
                0 && <Grid item>{securityButton()}</Grid>}
            </Grid>
          </Box>
        )}
      </Box>
      <Copyright sx={{ mt: 4, mb: 4 }} />
    </CenterForm>
  );
}
