import React, { useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import {
  HttpMethod,
  PutMonitorRequest,
  MonitorStatus,
  MonitorType,
  BodyForm,
  Pair,
  NotificationType,
} from "@boardware/argus-ts-sdk";
import Settings from "./Settings";
import Headers from "./Headers";
import Notifications from "./Notifications";

enum MonitorConfiguration {
  Body,
  Headers,
  Settings,
  Notifications,
}

interface IProps {
  putMonitorRequest?: PutMonitorRequest;
  name?: string;
  description?: string;
  interval?: number;
  method?: HttpMethod;
  url?: string;
  timeout?: number;
  notificationInterval?: number;
  headers?: Pair[];
  to?: string;
  acceptedStatusCodes?: string[];
  onEmit?: (request: PutMonitorRequest) => void;
  title: string;
  bodyForm?: BodyForm;
}

function style() {
  return {
    size: "small" as "small" | "medium",
  };
}

const MonitorForm: React.FC<IProps> = (props) => {
  const navigate = useNavigate();
  const [name, setName] = useState(props.name || "");
  const [description, setDescription] = useState(props.description || "");
  const [retries, setRetries] = useState(3);
  const [headers, setHeaders] = useState<Pair[]>(() => {
    return props.headers || [];
  });
  const [acceptedStatusCodes, setAcceptedStatusCodes] = useState<string[]>(
    () => {
      return props.acceptedStatusCodes || [];
    }
  );
  const [settingIndex, setSettingIndex] = useState(
    MonitorConfiguration.Settings
  );
  const [interval, setInterval] = useState(
    props.interval ? props.interval / 60 : 5
  );
  const [method, setMethod] = useState<HttpMethod>(
    props.method || HttpMethod.Get
  );
  const [url, setUrl] = useState(props.url || "");
  const [timeout, setTimeout] = useState(props.timeout || 5);
  const [notificationInterval, setNotificationInterval] = useState(
    props.notificationInterval ? props.notificationInterval / 60 : 15
  );
  const [to, setTo] = useState(props.to || "");
  const [formError, setFormError] = useState({
    name: false,
    url: false,
    to: false,
  });
  function submit() {
    setFormError({
      name: name === "",
      url: url === "",
      to: to === "",
    });
    if (name === "" || url === "" || to === "" || !props.onEmit) {
      return;
    }
    props.onEmit({
      name,
      description,
      type: MonitorType.Http,
      status: MonitorStatus.Actived,
      httpMonitor: {
        url,
        interval: interval * 60,
        timeout,
        method,
        retries,
        headers,
        acceptedStatusCodes,
      },
      notificationGroup: {
        interval: notificationInterval * 60,
        notifications: [
          {
            type: NotificationType.Email,
            email: {
              receivers: {
                to: [to],
                cc: [],
                bcc: [],
              },
            },
          },
        ],
      },
    });
  }
  const inputStyle = { size: "small", margin: 0, width: `100%` };
  return (
    <Paper sx={{ width: "100%", mb: 1 }} style={{ padding: 12 }}>
      <Grid container spacing={2}>
        <Grid item>
          <div>
            <IconButton onClick={() => navigate("/dashboard/uptime")}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <Typography variant="subtitle1" component="span">
              {props.title}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...style()}
            style={inputStyle}
            error={formError.name}
            className="create-monitor-input"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="outlined-required"
            label="Name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            {...style()}
            style={inputStyle}
            className="create-monitor-input"
            value={description}
            multiline
            minRows={2}
            maxRows={4}
            onChange={(e) => setDescription(e.target.value)}
            id="outlined-required"
            label="Description"
          />
        </Grid>
        <Grid item xs={12}>
          <Divider>Monitor setting</Divider>
        </Grid>
        <Grid item xs={2}>
          <FormControl {...style()} fullWidth>
            <InputLabel id="demo-simple-select-label">Method</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={method}
              label="Method"
              onChange={(e) => setMethod(e.target.value as HttpMethod)}>
              <MenuItem value={HttpMethod.Get}>Get</MenuItem>
              <MenuItem value={HttpMethod.Post}>Post</MenuItem>
              <MenuItem value={HttpMethod.Put}>Put</MenuItem>
              <MenuItem value={HttpMethod.Head}>Head</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <TextField
            {...style()}
            style={inputStyle}
            error={formError.url}
            className="create-monitor-input"
            value={url}
            type="string"
            onChange={(e) => setUrl(e.target.value)}
            id="outlined-required"
            label="Url"
            helperText="http(s)://xxx.xxx.xxx/xxx"
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            {...style()}
            style={inputStyle}
            className="create-monitor-input"
            required
            type="number"
            value={retries}
            onChange={(e) =>
              setRetries(Math.max(Math.min(Number(e.target.value), 10), 0))
            }
            id="outlined-required"
            label="Retries"
          />
        </Grid>
        <Grid item xs={12}>
          <Tabs
            value={settingIndex}
            onChange={(_, i) => {
              setSettingIndex(i);
            }}
            aria-label="basic tabs example">
            <Tab
              label={`Headers (${headers ? headers.length : 0})`}
              value={MonitorConfiguration.Headers}
            />
            {/* <Tab label="Body" value={MonitorConfiguration.Body} /> */}
            <Tab label="Settings" value={MonitorConfiguration.Settings} />
            {/* <Tab
              label="Notifications"
              value={MonitorConfiguration.Notifications}
            /> */}
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          <Settings
            acceptedStatusCodes={acceptedStatusCodes}
            setAcceptedStatusCodes={setAcceptedStatusCodes}
            interval={interval}
            setInterval={setInterval}
            timeout={timeout}
            setTimeout={setTimeout}
            show={settingIndex === MonitorConfiguration.Settings}></Settings>
          {/* <Body
            bodyRaw={bodyRaw}
            setBodyRaw={setBodyRaw}
            contentType={contentType}
            setContentType={setContentType}
            bodyForm={bodyForm}
            setBodyForm={setBodyForm}
            show={settingIndex === MonitorConfiguration.Body}></Body> */}
          <Box hidden={settingIndex !== MonitorConfiguration.Headers}>
            <Headers
              headers={headers}
              setHeaders={setHeaders}
              show={settingIndex === MonitorConfiguration.Headers}></Headers>
          </Box>
          <Box hidden={settingIndex !== MonitorConfiguration.Notifications}>
            <Notifications />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider>Notification setting</Divider>
        </Grid>
        <Grid item xs={12}>
          <TextField
            size="small"
            error={formError.to}
            className="create-monitor-input"
            style={inputStyle}
            value={to}
            type="email"
            required
            onChange={(e) => setTo(e.target.value)}
            id="outlined-required"
            label="To Email"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography id="non-linear-slider" gutterBottom>
            Notification cooldown: {notificationInterval} mintues
          </Typography>
          <Slider
            onChange={(_, value) =>
              setNotificationInterval(Math.max(1, Number(value)))
            }
            value={notificationInterval}
            min={1}
            step={1}
            max={30}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            style={{ width: `100%` }}
            variant="contained"
            onClick={submit}
            endIcon={<SendIcon />}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MonitorForm;
