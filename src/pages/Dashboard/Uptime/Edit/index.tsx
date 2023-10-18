import React from "react";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import monitorApi from "../../../../api/monitor";
import MonitorForm from "../../../../components/Monitor/Form";
import { Monitor } from "@boardware/argus-ts-sdk";
import { useSnackbar } from "notistack";

const Create: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();
  const { monitor } = useLoaderData() as { monitor: Monitor };
  return (
    <MonitorForm
      initMonitor={monitor}
      onSubmit={(request) => {
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
