import React, { useEffect, useState } from "react";
import Field from "./Field";
import {
  Button,
  MenuItem,
  Paper,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import { NotificationType, Notification } from "@boardware/argus-ts-sdk";
import TextArea from "antd/es/input/TextArea";

const NotificationSetting: React.FC<{
  init?: Notification;
  addNotification: (notification: Notification) => void;
}> = ({ addNotification, init }) => {
  const [notification, setNotification] = useState<Notification>(
    init || {
      type: NotificationType.Email,
    }
  );
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  useEffect(() => {
    if (init !== undefined) {
      if (init.email?.receivers?.to.length !== 0) {
        setTo(init.email!.receivers!.to[0]);
      }
      if (init.email?.receivers?.cc.length !== 0) {
        setCc(init.email!.receivers!.cc[0]);
      }
      if (init.email?.receivers?.bcc.length !== 0) {
        setBcc(init.email!.receivers!.bcc[0]);
      }
    }
  }, []);
  useEffect(() => {
    setNotification({
      ...notification,
      email: {
        receivers: {
          to: to !== "" ? [to] : [],
          cc: cc !== "" ? [cc] : [],
          bcc: bcc !== "" ? [bcc] : [],
        },
        template: `<html>
  <body>
    <div>Url: __TARGET__</div>
    <div>Time: __TIME__</div>
    <div>Status: __STATUS__</div>
  </body>
</html>`,
      },
    });
  }, [to, cc, bcc]);
  return (
    <Paper style={{ minWidth: 400, padding: 20 }}>
      <Field label="Notification type">
        <Select
          value={notification.type}
          onChange={(e) =>
            setNotification({
              ...notification,
              type: e.target.value as NotificationType,
            })
          }
          style={{ width: `100%` }}>
          <MenuItem value={NotificationType.Email}>Email</MenuItem>
        </Select>
      </Field>
      <Field label={`Cooldown: ${(notification.interval || 60) / 60} minutes`}>
        <Slider
          max={3600}
          min={60}
          step={60}
          value={notification.interval || 60}
          onChange={(_, v) =>
            setNotification({ ...notification, interval: v as number })
          }
        />
      </Field>
      <Field label="To">
        <TextField
          style={{ width: `100%` }}
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}></TextField>
      </Field>
      <Field label="Cc">
        <TextField
          style={{ width: `100%` }}
          type="email"
          value={cc}
          onChange={(e) => setCc(e.target.value)}></TextField>
      </Field>
      <Field label="Bcc">
        <TextField
          style={{ width: `100%` }}
          type="email"
          value={bcc}
          onChange={(e) => setBcc(e.target.value)}></TextField>
      </Field>
      <Field label="Email template">
        <TextArea
          value={notification.email?.template}
          onChange={(e) =>
            setNotification({
              ...notification,
              email: { ...notification.email, template: e.target.value },
            })
          }
          autoSize={{ minRows: 4 }}
        />
      </Field>
      <Button
        onClick={() => {
          addNotification(notification);
        }}>
        SUBMIT
      </Button>
    </Paper>
  );
};
export default NotificationSetting;
