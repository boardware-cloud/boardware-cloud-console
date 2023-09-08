import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { sha256 } from "../../utils/account";
import Copyright from "../../components/Copyright";
import { message } from "antd";
import { ResponseError } from "@boardware/argus-ts-sdk";
import accountApi, { ticketApi } from "../../api/core";
import { Chip, Paper } from "@mui/material";
import VerificationCodeButton from "../../components/VerificationCodeButton";
import { TicketType, VerificationCodePurpose } from "@boardware/core-ts-sdk";
import { webauthnTicket } from "../../utils/webauthn";

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
  const [passwordTicket, setPasswordTicket] = React.useState("");
  const [tickets, setTickets] = React.useState<string[]>([]);
  React.useEffect(() => {
    if (tickets.length == 2) {
      setTimeout(() => {
        accountApi
          .createSession({
            createSessionRequest: {
              email: email,
              tickets: tickets,
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
      }, 250);
    }
  }, [tickets]);
  const [stage, setStage] = React.useState<Stage>(Stage.EMAIL);
  const [verificationCode, setVerificationCode] = React.useState("");
  const [totpCode, setTotpCode] = React.useState("");

  const [totpError, setTotpError] = React.useState(false);
  const hasTotp = React.useMemo(() => {
    return factors.findIndex((fa) => fa === "TOTP") !== -1;
  }, [factors]);
  const getFactors = () => {
    if (!email) {
      setEmailError(true);
      messageApi.error("Email are required!");
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
      });
  };
  const verificationPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password) {
      setPasswordError(true);
      messageApi.error("Password are required!");
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
        setStage(Stage.VERIFICATION_CODE);
        setTickets((tickets) => [...tickets, ticket.token]);
      });
  };
  const totpSignin = () => {
    if (!totpCode) {
      setTotpError(true);
      messageApi.error("One-time password are required!");
      return;
    }
    ticketApi
      .createTicket({
        createTicketRequest: {
          email: email,
          type: TicketType.Totp,
          totpCode: totpCode,
        },
      })
      .then((ticket) => {
        setTickets((tickets) => [...tickets, ticket.token]);
      });
  };
  React.useEffect(() => {
    if (totpCode.length !== 6) return;
    totpSignin();
  }, [totpCode]);
  return (
    <Container
      component="main"
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        paddingTop: 20,
      }}>
      {contextHolder}
      <Paper
        style={{
          width: 400,
          padding: 20,
        }}>
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
                margin="normal"
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                onClick={getFactors}
                sx={{ mt: 3, mb: 2 }}>
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
            <Box
              component="form"
              onSubmit={verificationPassword}
              noValidate
              sx={{ mt: 1 }}>
              <TextField
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
                sx={{ mt: 3, mb: 2 }}>
                Next
              </Button>
            </Box>
          )}
          {stage === Stage.VERIFICATION_CODE && (
            <Box
              component="div"
              style={{ alignContent: "center" }}
              sx={{ mt: 1 }}>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={1}>
                <Grid item>
                  <Typography component="h1" variant="h5">
                    2FA - Email
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography component="h2" variant="subtitle1">
                    To help keep your account safe, BoardWare wants to make sure
                    it’s really you trying to sign in
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <VerificationCodeButton
                    setCode={setVerificationCode}
                    code={verificationCode}
                    purpose={VerificationCodePurpose.Ticket}
                    email={email}></VerificationCodeButton>
                  <Button
                    onClick={() => {
                      ticketApi
                        .createTicket({
                          createTicketRequest: {
                            email: email,
                            type: TicketType.Email,
                            verificationCode: verificationCode,
                          },
                        })
                        .then((ticket) => {
                          setTickets((tickets) => [...tickets, ticket.token]);
                        });
                    }}
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}>
                    Sign In
                  </Button>
                </Grid>
                {hasTotp && (
                  <Grid item xs={12}>
                    <Button onClick={() => setStage(Stage.TOTP)}>
                      Use TOTP One-time password
                    </Button>
                  </Grid>
                )}
                {factors.filter((factor) => factor === "WEBAUTHN").length !==
                  0 && (
                  <Grid item>
                    <Button
                      onClick={() =>
                        webauthnTicket(email).then((ticket: any) =>
                          setTickets((tickets) => [
                            ...tickets,
                            ticket.token as string,
                          ])
                        )
                      }>
                      Use security key
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
          {stage === Stage.TOTP && (
            <Box
              component="div"
              style={{ alignContent: "center" }}
              sx={{ mt: 1 }}>
              <Grid
                container
                direction="column"
                alignItems="center"
                spacing={1}>
                <Grid item>
                  <Typography component="h1" variant="h5">
                    2FA - TOTP
                  </Typography>
                </Grid>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <Button onClick={() => setStage(Stage.VERIFICATION_CODE)}>
                    Use Email Verification code
                  </Button>
                </Grid>
                {factors.filter((factor) => factor === "WEBAUTHN").length !==
                  0 && (
                  <Grid item>
                    <Button
                      onClick={() =>
                        webauthnTicket(email).then((ticket: any) =>
                          setTickets((tickets) => [
                            ...tickets,
                            ticket.token as string,
                          ])
                        )
                      }>
                      Use security key
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </Box>

        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Paper>
    </Container>
  );
}
