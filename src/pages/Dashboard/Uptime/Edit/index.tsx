import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import monitorApi from "../../../../api/monitor";
import MonitorForm from "../../../../components/MonitorForm";
import { Monitor } from "argus-ts-sdk";

const Create: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [monitor, setMonitor] = useState<Monitor | undefined>();
  useEffect(() => {
    monitorApi.getMonitor({ id: id! }).then((monitor) => {
      setMonitor(monitor);
    });
  }, [id]);
  return (
    <>
      {monitor && (
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
                navigate("/dashboard/uptime/monitors/" + id);
              });
          }}
        />
      )}
    </>
  );
};

export default Create;
