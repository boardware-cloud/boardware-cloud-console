import React from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import monitorApi from "../../../../api/monitor";
import MonitorForm from "../../../../components/MonitorForm";
import { Monitor } from "@boardware/argus-ts-sdk";
import { useSnackbar } from "notistack";

const Create: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const { monitor } = useLoaderData() as { monitor: Monitor };

  return (
    <MonitorForm
      bodyForm={monitor.body ? monitor.body.form : undefined}
      acceptedStatusCodes={monitor.acceptedStatusCodes}
      name={monitor.name}
      description={monitor.description}
      interval={monitor.interval}
      timeout={monitor.timeout}
      url={monitor.url}
      headers={monitor.headers}
      notificationInterval={monitor.notificationInterval}
      to={monitor.notifications[0].emailReceivers?.to[0]}
      title="Edit monitor"
      onEmit={(request) => {
        monitorApi
          .updateMonitor({ id: id!, putMonitorRequest: request })
          .then(() => {
            enqueueSnackbar("Monitor updated.", { variant: "success" });
            navigate("/dashboard/uptime/monitors/" + id);
          });
      }}
    />
  );
};

export default Create;
