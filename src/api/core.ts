import {
  AccountApi,
  Configuration,
  ConfigurationParameters,
  VerificationApi,
  TicketApi,
} from "@boardware/core-ts-sdk";

export const token = localStorage.getItem("token");

export let basePath = "https://core-uat.k8s19932be1.boardware.com";
// export let basePath = "http://localhost:8080";

const accountApi = new AccountApi(
  new Configuration({
    basePath: basePath,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } as ConfigurationParameters)
);

export const verificationApi = new VerificationApi(
  new Configuration({
    basePath: basePath,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } as ConfigurationParameters)
);

export const ticketApi = new TicketApi(
  new Configuration({
    basePath: basePath,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  } as ConfigurationParameters)
);

export default accountApi;
