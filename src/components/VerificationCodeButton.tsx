import { Visibility } from "@mui/icons-material";
import {
  InputAdornment,
  FormControl,
  FilledInput,
  InputLabel,
  IconButton,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { verificationApi } from "../api/core";
import { ResponseError, VerificationCodePurpose } from "@boardware/core-ts-sdk";

interface IProps {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  autoSend?: boolean;
  purpose?: VerificationCodePurpose;
}

const VerificationCodeButton: React.FC<IProps> = ({
  email,
  autoSend,
  purpose,
  code,
  setCode,
}) => {
  const [reciprocal, setReciprocal] = useState(0);
  const sendVerificationCode = () => {
    verificationApi
      .createVerificationCode({
        createVerificationCodeRequest: {
          email: email,
          purpose: purpose || VerificationCodePurpose.Signin,
        },
      })
      .then(() => {
        let r = 60;
        setReciprocal(r);
        const interval = setInterval(() => {
          setReciprocal(--r);
          if (r === 0) {
            clearInterval(interval);
          }
        }, 1000);
      })
      .catch((e: ResponseError) => {
        e.response.json().then((err) => {});
      });
  };
  return (
    <FormControl fullWidth sx={{}} variant="filled">
      <InputLabel htmlFor="filled-adornment-password">
        Verification code
      </InputLabel>
      <FilledInput
        fullWidth
        value={code}
        onChange={(e) => setCode(e.target.value)}
        id="filled-adornment-password"
        endAdornment={
          <InputAdornment position="end">
            <Button
              onClick={sendVerificationCode}
              disabled={reciprocal !== 0}
              variant="contained">
              {reciprocal === 0 ? "Verify" : reciprocal + "s"}
            </Button>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default VerificationCodeButton;
