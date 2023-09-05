import {
  Autocomplete,
  Box,
  Chip,
  Grid,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface IProps {
  show?: boolean;
  interval: number;
  setInterval: React.Dispatch<React.SetStateAction<number>>;
  timeout: number;
  setTimeout: React.Dispatch<React.SetStateAction<number>>;
  acceptedStatusCodes: string[];
  setAcceptedStatusCodes: React.Dispatch<React.SetStateAction<string[]>>;
}

const options = [{ label: "200" }, { label: "200-299" }];

const Settings: React.FC<IProps> = ({
  show,
  interval,
  setInterval,
  timeout,
  setTimeout,
  acceptedStatusCodes,
  setAcceptedStatusCodes,
}) => {
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  return (
    <Box hidden={!show}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography id="non-linear-slider">
            Check every {interval} minutes
          </Typography>
          <Slider
            size="small"
            onChange={(_, value) => setInterval(Number(value))}
            value={interval}
            min={1}
            step={1}
            max={30}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
          />
        </Grid>
        <Grid item xs={6}>
          <Typography id="non-linear-slider">
            Timeout: {timeout} second
          </Typography>
          <Slider
            size="small"
            onChange={(_, value) => setTimeout(Number(value))}
            value={timeout}
            min={1}
            step={1}
            max={30}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
          />
        </Grid>
        <Grid item xs={12}>
          {acceptedStatusCodes.map((code, i) => {
            return (
              <Chip
                onDelete={() =>
                  setAcceptedStatusCodes(
                    acceptedStatusCodes.filter((_, index) => index !== i)
                  )
                }
                key={i}
                variant="outlined"
                label={code}></Chip>
            );
          })}
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={codeError}
            value={code}
            onChange={(e) => {
              setCodeError(false);
              setCode(e.target.value);
            }}
            onKeyDown={(e) => {
              if (code === "") return;
              if (e.key === "Enter") {
                setAcceptedStatusCodes([...acceptedStatusCodes, code]);
                setCode("");
              }
            }}
            size="small"
            id="outlined-basic"
            label="Accepted status code"
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
