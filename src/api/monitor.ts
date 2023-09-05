import {
  MonitorApi,
  Configuration,
  ConfigurationParameters,
} from "argus-ts-sdk";

const token = localStorage.getItem("token");

let basePath = "https://argus-uat.k8s19932be1.boardware.com";

const monitorApi = new MonitorApi(
  new Configuration({
    basePath: basePath,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } as ConfigurationParameters)
);

export default monitorApi;
