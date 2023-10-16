import React from "react";
import { useNavigate } from "react-router-dom";
import monitorApi from "../../../../api/monitor";
import MonitorForm from "../../../../components/MonitorForm";
import { useSnackbar } from "notistack";

const Create: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  return (
    <MonitorForm
      title="Create Monitor"
      onEmit={(request) => {
        console.log(request);
        monitorApi
          .createMonitor({
            putMonitorRequest: request,
          })
          .then((monitor) => {
            enqueueSnackbar("Monitor created", { variant: "success" });
            navigate("/dashboard/uptime/monitors/" + monitor.id);
          })
          .catch(() => {
            alert("Error");
          });
      }}
    />
  );
};

export default Create;
