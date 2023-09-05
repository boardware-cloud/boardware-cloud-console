import { sha3_256 } from "js-sha3";
import accountApi from "../api/core";

export function login(email: string, password: string) {
  return accountApi.createSession({
    createSessionRequest: {
      email: email,
      password: password,
    },
  });
}

export function sha256(message: string) {
  return sha3_256(message);
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/signin";
}
