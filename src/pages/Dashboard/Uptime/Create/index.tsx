import React from "react";
import { useNavigate } from "react-router-dom";
import monitorApi from "../../../../api/monitor";
import MonitorForm from "../../../../components/MonitorForm";

const Create: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MonitorForm
      title="Create Monitor"
      onEmit={(request) => {
        monitorApi
          .createMonitor({
            putMonitorRequest: request,
          })
          .then((monitor) => {
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
