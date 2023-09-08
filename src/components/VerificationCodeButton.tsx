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
  purpose?: VerificationCodePurpose;
  onFrequent?: () => void;
}

const VerificationCodeButton: React.FC<IProps> = ({
  email,
  purpose,
  code,
  setCode,
  onFrequent,
}) => {
  const [reciprocal, setReciprocal] = useState(0);
  const [loading, setLoading] = useState(false);
  const sendVerificationCode = () => {
    setLoading(true);
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
        if (onFrequent) onFrequent();
        e.response.json().then((err) => {});
      })
      .finally(() => {
        setLoading(false);
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
              disabled={reciprocal !== 0 || loading}
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
