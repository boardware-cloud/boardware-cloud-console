import { Encode, Decode } from "arraybuffer-encoding/base64/url";
import { basePath } from "../api/core";

export function webauthnTicket(email: string) {
  return new Promise((resolve, reject) => {
    let id = "";
    fetch(`${basePath}/account/webauthn/sessions/tickets/challenge`, {
      method: "POST",
      headers: [["Content-Type", "application/json"]],
      body: JSON.stringify({ email: email }),
    })
      .then((e) => e.json())
      .then((json) => {
        json.publicKey.challenge = Decode(json.publicKey.challenge);
        json.publicKey.allowCredentials.forEach(function (listItem: any) {
          listItem.id = Decode(listItem.id);
        });
        id = json.id;
        return navigator.credentials.get({
          publicKey: json.publicKey,
        });
      })
      .then((assertion: any) => {
        const authenticatorAssertionResponse = {
          type: assertion.type,
          id: assertion.id,
          rawId: Encode(assertion.rawId),
          response: {
            authenticatorData: Encode(assertion.response.authenticatorData),
            clientDataJSON: Encode(assertion.response.clientDataJSON),
            signature: Encode(assertion.response.signature),
            userHandle: Encode(assertion.response.userHandle),
          },
        };

        fetch(`${basePath}/account/webauthn/sessions/tickets/` + id, {
          method: "POST",
          body: JSON.stringify(authenticatorAssertionResponse),
        })
          .then((e) => e.json())
          .then((json) => {
            resolve(json);
          })
          .catch((e) => {
            reject(e);
          });
      })
      .catch((e) => {
        reject(e);
      });
  });
}

export function createWebAuthn() {
  let id = "";
  fetch("http://127.0.0.1:8080/account/webauthn/sessions", {
    method: "POST",
    headers: [
      [
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTM5NzMwNTQsImlkIjoiMTY5MjQ1MTI3MzU3MzQwNDY3MiIsImVtYWlsIjoiY2hlbnl1bmRhMjE4QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFRCJ9.yEgvEfX6NNUr4XJ9dnfY2Xhf8u_qAO3e2iygOb7Hs0A",
      ],
    ],
  })
    .then((resp) => resp.json())
    .then((json) => {
      json.publicKey.challenge = Decode(json.publicKey.challenge);
      json.publicKey.user.id = Decode(json.publicKey.user.id);
      id = json.id;
      return navigator.credentials.create({ publicKey: json.publicKey });
    })
    .then((credential: any) => {
      const response = credential.response as any;
      const attestationObj = response.attestationObject;
      const transports = response.getTransports();
      const create = {
        type: "public-key",
        id: credential.id,
        rawId: credential.id,
        response: {
          attestationObject: Encode(attestationObj),
          clientDataJSON: Encode(response.clientDataJSON),
        },
        transports: transports,
      };
      return fetch("http://127.0.0.1:8080/2account/webauthn/sessions/" + id, {
        body: JSON.stringify(create),
        method: "POST",
        headers: [
          [
            "Authorization",
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTM5NzMwNTQsImlkIjoiMTY5MjQ1MTI3MzU3MzQwNDY3MiIsImVtYWlsIjoiY2hlbnl1bmRhMjE4QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwic3RhdHVzIjoiQUNUSVZFRCJ9.yEgvEfX6NNUr4XJ9dnfY2Xhf8u_qAO3e2iygOb7Hs0A",
          ],
        ],
      });
    })
    .then((resp) => resp.json())
    .then((json) => {
      console.log(json);
    })
    .catch((e) => {
      console.log(e);
    });
}
