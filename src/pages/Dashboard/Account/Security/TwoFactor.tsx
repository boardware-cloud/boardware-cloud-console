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
  Link,
} from "@mui/material";
import { Account, WebAuthn } from "@boardware/core-ts-sdk";
import React, { useEffect, useMemo, useState } from "react";
import accountApi, { basePath, token } from "../../../../api/core";
import { Decode, Encode } from "arraybuffer-encoding/base64/url";
import { useNavigate } from "react-router-dom";
import { Popconfirm, Space, Tag } from "antd";
import SectionTitle from "../../../../components/SectionTitle";
// Icon
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const TwoFactor: React.FC = () => {
  const nav = useNavigate();
  const [openWebAuthn, setOpenWebAuthn] = useState(false);
  const [showAddWebAuthn, setShowAddWebAuthn] = useState(false);
  const [webAuthnName, setWebAuthnName] = useState("");
  const [webAuths, setWebAuths] = useState<WebAuthn[]>([]);
  const [account, setAccount] = useState<Account>();
  const [factors, setFactors] = useState<string[]>([]);
  const hasTotp = useMemo(() => {
    return factors.findIndex((factor) => factor === "TOTP") !== -1;
  }, [factors]);
  const getAccount = () => {
    accountApi.getAccount().then((account) => setAccount(account));
  };
  useEffect(() => {
    getAccount();
    getWebAuths();
  }, []);
  useEffect(() => {
    if (!account) return;
    accountApi
      .getAuthentication({ email: account.email })
      .then(({ factors }) => {
        setFactors(factors);
      });
  }, [account]);
  const getWebAuths = () => {
    accountApi.listWebAuthn().then((webAuths) => {
      setWebAuths(webAuths);
    });
  };
  const deleteTotp = () => {
    if (!account) return;
    accountApi.deleteTotp().then(() => {
      getAccount();
    });
  };
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
        <Link
          target="_blank"
          href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/about-two-factor-authentication"
          underline="hover">
          Learn more about two-factor authentication.
        </Link>
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
              primary={
                <Space>
                  <span>Security keys</span>
                  {webAuths.length !== 0 && (
                    <span>
                      <Tag color="success">Configured</Tag>
                      <Tag color="blue">{webAuths.length} keys</Tag>
                    </span>
                  )}
                </Space>
              }
              secondary={
                "Security keys are hardware devices that can be used as your second factor of authentication."
              }
            />
          </ListItem>
          <Collapse in={openWebAuthn} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {webAuths.map((webAuth) => {
                return (
                  <ListItem
                    key={webAuth.id}
                    secondaryAction={
                      <Popconfirm
                        title="Delete security keys"
                        description="Are you sure to delete security keys?"
                        okText="Yes"
                        onConfirm={() => deleteWebauthn(webAuth.id)}
                        cancelText="No">
                        <IconButton edge="end">
                          <DeleteForeverIcon />
                        </IconButton>
                      </Popconfirm>
                    }>
                    <ListItemIcon>
                      <FingerprintIcon />
                    </ListItemIcon>
                    {webAuth.name}
                    <span
                      style={{
                        marginLeft: 5,
                        fontWeight: "lighter",
                        fontSize: 14,
                      }}>
                      - registered on{" "}
                      {new Date(webAuth.createdAt * 1000).toDateString()}
                    </span>
                  </ListItem>
                );
              })}
              {!showAddWebAuthn && (
                <ListItem>
                  <ListItemIcon>
                    <FingerprintIcon />
                  </ListItemIcon>
                  <Button
                    startIcon={<AddCircleIcon></AddCircleIcon>}
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
              <>
                {hasTotp ? (
                  <Popconfirm
                    title="Delete TOTP"
                    description="Are you sure to delete TOTP?"
                    okText="Yes"
                    onConfirm={deleteTotp}
                    cancelText="No">
                    <IconButton edge="end">
                      <DeleteForeverIcon />
                    </IconButton>
                  </Popconfirm>
                ) : (
                  <IconButton
                    onClick={() => {
                      nav("/dashboard/account/security/totp");
                    }}
                    edge="end">
                    <AppSettingsAltIcon />
                  </IconButton>
                )}
              </>
            }>
            <ListItemIcon>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <Space>
                  <span>TOTP</span>
                  {hasTotp && <Tag color="success">Configured</Tag>}
                </Space>
              }
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
