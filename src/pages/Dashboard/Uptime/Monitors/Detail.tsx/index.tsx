import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import monitorApi from "../../../../../api/monitor";
import {
  Monitor,
  MonitorStatus,
  MonitoringRecord,
} from "@boardware/argus-ts-sdk";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Button,
  Paper,
  Grid,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  styled,
  Stack,
  IconButton,
} from "@mui/material";
import Heartbeat from "./Heartbeat";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import PauseIcon from "@mui/icons-material/Pause";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const MonitorDetail: React.FC = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [monitor, setMonitor] = React.useState<Monitor | undefined>();
  const [records, setRecords] = React.useState<MonitoringRecord[]>([]);
  const [showCopyed, setShowCopyed] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  useEffect(() => {
    if (showCopyed) {
      setTimeout(() => {
        setShowCopyed(false);
      }, 3000);
    }
  }, [showCopyed]);
  const getRecords = (id: string) => {
    monitorApi
      .listMonitoringRecords({ id, limit: 30, index: 0 })
      .then((r) => {
        if (!r) return;
        setRecords(r.data!);
        setRecords(r.data!);
      })
      .catch((e) => console.log(e));
  };
  const deleteMonitor = () => {
    monitorApi.deleteMonitor({ id: id! }).then(() => {
      navigate("/dashboard/uptime");
    });
  };
  useEffect(() => {
    if (!id) return;
    monitorApi
      .getMonitor({ id: id })
      .then((m) => {
        setMonitor(m);
      })
      .catch((e) => console.log(e));
    getRecords(id!);

    const polling = () => {
      const intervalId = setInterval(getRecords, 10000, [id]);
      return () => {
        clearInterval(intervalId);
      };
    };
    const clean = polling();
    return () => {
      clean();
    };
  }, []);
  const active = () => {
    if (!monitor) return;
    monitorApi
      .updateMonitor({
        id: id!,
        putMonitorRequest: {
          headers: monitor.headers,
          name: monitor.name,
          description: monitor.description,
          type: monitor.type,
          interval: monitor.interval,
          timeout: monitor.timeout,
          method: monitor.method,
          notificationInterval: monitor.notificationInterval,
          status:
            monitor.status === MonitorStatus.Actived
              ? MonitorStatus.Disactived
              : MonitorStatus.Actived,
          url: monitor.url,
          retries: monitor.retries,
          notifications: monitor.notifications,
          acceptedStatusCodes: monitor.acceptedStatusCodes,
        },
      })
      .then(() => {
        monitorApi.getMonitor({ id: id! }).then((m) => {
          setMonitor(m);
        });
      });
  };
  return (
    <Paper sx={{ width: "100%", mb: 2 }} style={{ padding: 20 }}>
      <div>
        <IconButton onClick={() => navigate("/dashboard/uptime")}>
          <ArrowBackIosNewIcon />
        </IconButton>
      </div>
      {monitor && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h2>{monitor.name}</h2>
              </Grid>
              <Grid item xs={12}>
                <Button
                  endIcon={showCopyed && <SpellcheckIcon></SpellcheckIcon>}
                  startIcon={<InsertLinkIcon></InsertLinkIcon>}
                  onClick={() => {
                    setShowCopyed(true);
                    navigator.clipboard.writeText(monitor.url);
                  }}
                  style={{ textTransform: "none" }}
                  variant="text">
                  {monitor.url}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group">
                  {monitor.status === MonitorStatus.Actived ? (
                    <Button
                      onClick={active}
                      variant="contained"
                      startIcon={<PauseIcon />}>
                      Pause
                    </Button>
                  ) : (
                    <Button
                      onClick={active}
                      variant="outlined"
                      startIcon={<RestartAltIcon />}>
                      Resume
                    </Button>
                  )}
                  <Button
                    onClick={() =>
                      navigate("/dashboard/uptime/monitors/" + id! + "/edit")
                    }
                    variant="contained"
                    startIcon={<EditIcon />}>
                    Edit
                  </Button>
                  <Button
                    onClick={() => setShowDelete(true)}
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}>
                    Delete
                  </Button>
                </ButtonGroup>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" component={"span"}>
                  Check every {monitor.interval} seconds
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Heartbeat records={records} />
            </Grid>
          </Grid>
        </Grid>
      )}
      <Dialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to delete this monitor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<CancelIcon />}
            onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={deleteMonitor}
            startIcon={<DeleteIcon />}
            autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MonitorDetail;
