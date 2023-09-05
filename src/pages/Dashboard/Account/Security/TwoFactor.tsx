import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Button,
  Collapse,
  Divider,
  Input,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Account, WebAuthn } from "core-ts-sdk";
import React, { useEffect, useMemo, useState } from "react";
import accountApi, { basePath, token } from "../../../../api/core";
import { Decode, Encode } from "arraybuffer-encoding/base64/url";
import { useNavigate } from "react-router-dom";
// Icon
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SectionTitle from "../../../../components/SectionTitle";

const TwoFactor: React.FC = () => {
  const nav = useNavigate();
  const [openWebAuthn, setOpenWebAuthn] = useState(false);
  const [showAddWebAuthn, setShowAddWebAuthn] = useState(false);
  const [webAuthnName, setWebAuthnName] = useState("");
  const [webAuths, setWebAuths] = useState<WebAuthn[]>([]);
  const [account, setAccount] = useState<Account>();
  const hasTotp = useMemo(() => {
    if (!account) return false;
    if (!account) return false;
    return true;
  }, [account]);
  useEffect(() => {
    accountApi.getAccount().then((account) => setAccount(account));
  }, []);
  const getWebAuths = () => {
    accountApi.listWebAuthn().then((webAuths) => {
      setWebAuths(webAuths);
    });
  };
  useEffect(() => {
    getWebAuths();
  }, []);
  const deleteWebauthn = (id: string) => {
    accountApi.deleteWebAuthn({ id: id }).then(() => {
      setWebAuths(webAuths.filter((web) => web.id !== id));
    });
  };
  const registerSecurityKey = () => {
    accountApi.createWebAuthnChallenge().then((webAuthnSession) => {
      let createCredential = {
        ...webAuthnSession,
      } as any;
      createCredential.publicKey.challenge = Decode(
        webAuthnSession.publicKey.challenge
      );
      createCredential.publicKey.user.id = Decode(
        webAuthnSession.publicKey.user.id
      );
      const id = webAuthnSession.id;
      navigator.credentials
        .create(createCredential)
        .then((credential: any) => {
          const response = credential.response as any;
          const attestationObj = response.attestationObject;
          const transports = response.getTransports();
          const create = {
            name: webAuthnName,
            os: "",
            type: "public-key",
            id: credential.id,
            rawId: credential.id,
            response: {
              attestationObject: Encode(attestationObj),
              clientDataJSON: Encode(response.clientDataJSON),
            },
            transports: transports,
          };
          fetch(`${basePath}/account/webauthn/sessions/` + id, {
            body: JSON.stringify(create),
            method: "POST",
            headers: [
              ["Authorization", "Bearer " + token],
              ["Content-Type", "application/json"],
            ],
          }).then(() => {
            setWebAuthnName("");
            setShowAddWebAuthn(false);
            getWebAuths();
          });
        })
        .catch(() => {
          // TODO: error handling
        });
    });
  };
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <SectionTitle title={"Two-factor authentication"}></SectionTitle>
      </Grid>
      <Grid item>
        Two-factor authentication adds an additional layer of security to your
        account by requiring more than just a password to sign in.{" "}
        <a
          target="_blank"
          href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/about-two-factor-authentication">
          Learn more about two-factor authentication.
        </a>
      </Grid>
      <Grid item>
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Two-factor methods
            </ListSubheader>
          }>
          <ListItem
            secondaryAction={
              <IconButton
                onClick={() => setOpenWebAuthn(!openWebAuthn)}
                edge="end">
                {openWebAuthn ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            }>
            <ListItemIcon>
              <PrivacyTipIcon />
            </ListItemIcon>
            <ListItemText
              primary="Security keys"
              secondary={
                "Security keys are hardware devices that can be used as your second factor of authentication."
              }
            />
          </ListItem>
          <Collapse in={openWebAuthn} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {webAuths.map((webAuth, i) => {
                return (
                  <ListItem
                    key={i}
                    secondaryAction={
                      <IconButton
                        onClick={() => deleteWebauthn(webAuth.id)}
                        edge="end">
                        <DeleteForeverIcon />
                      </IconButton>
                    }>
                    <ListItemIcon>
                      <FingerprintIcon />
                    </ListItemIcon>
                    {webAuth.name}
                  </ListItem>
                );
              })}
              {!showAddWebAuthn && (
                <ListItem>
                  <ListItemIcon>
                    <FingerprintIcon />
                  </ListItemIcon>
                  <Button
                    onClick={() => setShowAddWebAuthn(true)}
                    variant="contained">
                    Register new security key
                  </Button>
                </ListItem>
              )}
              {showAddWebAuthn && (
                <ListItem
                  secondaryAction={
                    <IconButton onClick={registerSecurityKey} edge="end">
                      <AddIcon />
                    </IconButton>
                  }>
                  <ListItemIcon>
                    <FingerprintIcon />
                  </ListItemIcon>
                  <FormControl fullWidth size="small">
                    <InputLabel>
                      Enter a nickname for this security key
                    </InputLabel>
                    <Input
                      autoFocus
                      onBlur={() => setShowAddWebAuthn(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          registerSecurityKey();
                        }
                        if (e.key === "Escape") {
                          setShowAddWebAuthn(false);
                        }
                      }}
                      value={webAuthnName}
                      onChange={(e) => setWebAuthnName(e.target.value)}
                    />
                  </FormControl>
                </ListItem>
              )}
            </List>
          </Collapse>
          <ListItem
            secondaryAction={
              <IconButton
                onClick={() => {
                  nav("/dashboard/account/security/totp");
                }}
                edge="end">
                <AppSettingsAltIcon />
              </IconButton>
            }>
            <ListItemIcon>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText
              primary="TOTP"
              secondary={"Time-based one-time password."}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </List>
      </Grid>
    </Grid>
  );
};

export default TwoFactor;
