import {
  Button,
  Grid,
  MenuItem,
  Paper,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import Field from "./Field";
import React, { useMemo, useState } from "react";
import {
  HttpMethod,
  HttpMonitor,
  MonitorStatus,
  MonitorType,
  PingMonitor,
  PutMonitorRequest,
} from "@boardware/argus-ts-sdk";

function style() {
  return {
    size: "small" as "small" | "medium",
  };
}

const HttpMonitorSetting: React.FC<{
  httpMonitor?: HttpMonitor;
  setHttpMonitor: (h: HttpMonitor) => void;
}> = ({ httpMonitor, setHttpMonitor }) => {
  return (
    <>
      <Grid item sm={12}>
        <Field label={"Method"}>
          <Select
            value={
              httpMonitor
                ? httpMonitor.method || HttpMethod.Get
                : HttpMethod.Get
            }
            onChange={(e) =>
              setHttpMonitor({
                ...httpMonitor,
                method: e.target.value as HttpMethod,
              })
            }
            {...style()}
            style={{ width: `100%` }}>
            <MenuItem value={HttpMethod.Get}>Get</MenuItem>
            <MenuItem value={HttpMethod.Post}>Post</MenuItem>
            <MenuItem value={HttpMethod.Put}>Put</MenuItem>
            <MenuItem value={HttpMethod.Head}>Head</MenuItem>
          </Select>
        </Field>
      </Grid>
      <Grid item sm={12}>
        <Field label={"Url"}>
          <TextField
            value={httpMonitor ? httpMonitor.url || "" : ""}
            onChange={(e) =>
              setHttpMonitor({
                ...httpMonitor,
                url: e.target.value,
              })
            }
            {...style()}
            style={{ width: `100%` }}
          />
        </Field>
      </Grid>
      <Grid item sm={12} style={{}}>
        <Field
          label={`Heartbeat Interval (Check every ${
            httpMonitor ? httpMonitor.interval || 1 : 1
          } seconds)`}>
          <TextField
            value={httpMonitor ? httpMonitor.interval || 1 : 1}
            onChange={(e) =>
              setHttpMonitor({
                ...httpMonitor,
                interval: Number(e.target.value),
              })
            }
            type="number"
            {...style()}
            style={{ width: `100%` }}
          />
        </Field>
      </Grid>
      <Grid item sm={12}>
        <Field label={"Retries"}>
          <TextField
            value={httpMonitor ? httpMonitor.retries || 0 : 1}
            onChange={(e) =>
              setHttpMonitor({
                ...httpMonitor,
                retries: Number(e.target.value),
              })
            }
            type="number"
            {...style()}
            style={{ width: `100%` }}
          />
        </Field>
      </Grid>
      <Grid item sm={12}>
        <Field label={"Timeout"}>
          <TextField
            value={httpMonitor ? httpMonitor.timeout || 1 : 1}
            onChange={(e) =>
              setHttpMonitor({
                ...httpMonitor,
                timeout: Number(e.target.value),
              })
            }
            type="number"
            {...style()}
            style={{ width: `100%` }}
          />
        </Field>
      </Grid>
    </>
  );
};
const PingMonitorSetting: React.FC<{
  pingMonitor?: PingMonitor;
  setPingMonitor: (p: PingMonitor) => void;
}> = ({ pingMonitor, setPingMonitor }) => {
  return (
    <>
      <Grid item sm={12}>
        <Field label={"Host"}>
          <TextField
            value={pingMonitor ? pingMonitor.host || "" : ""}
            onChange={(e) =>
              setPingMonitor({
                ...pingMonitor,
                host: e.target.value,
              })
            }
            {...style()}
            style={{ width: `100%` }}
          />
        </Field>
      </Grid>
      <Grid item sm={12}>
        <Field label={"Interval"}>
          <TextField
            type="number"
            value={pingMonitor ? pingMonitor.interval || 1 : 1}
            onChange={(e) =>
              setPingMonitor({
                ...pingMonitor,
                interval: Number(e.target.value),
              })
            }
            {...style()}
            style={{ width: `100%` }}
          />
        </Field>
      </Grid>
    </>
  );
};

interface IProps {
  initMonitor?: PutMonitorRequest;
  onSubmit?: (putMonitorRequest: PutMonitorRequest) => void;
}

const MonitorForm: React.FC<IProps> = ({ initMonitor, onSubmit }) => {
  const [putMonitorRequest, setPutMonitorRequest] = useState<PutMonitorRequest>(
    initMonitor || { type: MonitorType.Http, status: MonitorStatus.Actived }
  );
  const httpMonitor = useMemo(() => {
    return putMonitorRequest.httpMonitor;
  }, [putMonitorRequest]);
  const [email, setEmail] = useState("");
  return (
    <Paper sx={{ width: "100%", mb: 1 }} style={{ padding: 12 }}>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", padding: 10 }}>
          <Grid container spacing={1}>
            <Grid item sm={12}>
              <h2>Setting</h2>
              <Field label={"Monitor type"}>
                <Select
                  style={{ width: `100%` }}
                  {...style()}
                  value={putMonitorRequest.type || MonitorType.Http}
                  onChange={(e) =>
                    setPutMonitorRequest({
                      ...putMonitorRequest,
                      type: e.target.value as MonitorType,
                    })
                  }>
                  <MenuItem value={MonitorType.Http}>Http</MenuItem>
                  <MenuItem value={MonitorType.Ping}>Ping</MenuItem>
                </Select>
              </Field>
            </Grid>
            <Grid item sm={12}>
              <Field label={"Nickname"}>
                <TextField
                  value={putMonitorRequest.name || ""}
                  onChange={(e) =>
                    setPutMonitorRequest({
                      ...putMonitorRequest,
                      name: e.target.value,
                    })
                  }
                  {...style()}
                  style={{ width: `100%` }}
                />
              </Field>
            </Grid>
            {putMonitorRequest.type == MonitorType.Http && (
              <HttpMonitorSetting
                httpMonitor={httpMonitor}
                setHttpMonitor={(h) => {
                  setPutMonitorRequest({
                    ...putMonitorRequest,
                    httpMonitor: h,
                  });
                }}></HttpMonitorSetting>
            )}
            {putMonitorRequest.type == MonitorType.Ping && (
              <PingMonitorSetting
                pingMonitor={putMonitorRequest.pingMonitor}
                setPingMonitor={(p) =>
                  setPutMonitorRequest({ ...putMonitorRequest, pingMonitor: p })
                }></PingMonitorSetting>
            )}
            <Grid item sm={12}>
              <Button onClick={() => onSubmit && onSubmit(putMonitorRequest)}>
                Save
              </Button>
            </Grid>
          </Grid>
        </div>
        <div style={{ width: "50%", padding: 10 }}>
          <Grid container>
            <Grid item sm={12}>
              <h2>Notifications setting</h2>
            </Grid>
            <Grid item sm={12}>
              <Field label={"Email"}>
                <TextField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  {...style()}
                  style={{ width: `100%` }}
                />
              </Field>
            </Grid>
          </Grid>
        </div>
      </div>
    </Paper>
  );
};

export default MonitorForm;
