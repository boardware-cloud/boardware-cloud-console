import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from "@mui/material";
import { BodyForm, ContentType } from "argus-ts-sdk";
import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { xml } from "@codemirror/lang-xml";

interface IProps {
  contentType: ContentType;
  setContentType: React.Dispatch<React.SetStateAction<ContentType>>;
  show?: boolean;
  bodyForm: BodyForm | undefined;
  setBodyForm: React.Dispatch<React.SetStateAction<BodyForm | undefined>>;
  bodyRaw: string;
  setBodyRaw: React.Dispatch<React.SetStateAction<string>>;
}

const Body: React.FC<IProps> = ({
  show,
  bodyForm,
  setBodyForm,
  contentType,
  setContentType,
}) => {
  const lang = useMemo(() => {
    switch (contentType) {
      case ContentType.Json:
        return [json()];
      case ContentType.Xml:
        return [xml()];
      default:
        return [];
    }
  }, [contentType]);
  return (
    <Box hidden={!show}>
      <Stack direction="row">
        <RadioGroup
          value={bodyForm}
          row
          onChange={(e) => setBodyForm(e.target.value as BodyForm)}
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group">
          <FormControlLabel value="none" control={<Radio />} label="none" />
          <FormControlLabel
            value={BodyForm.XWwwFormUrlencoded}
            control={<Radio />}
            label="x-www-urlencoded"
          />
          <FormControlLabel
            value={BodyForm.Raw}
            control={<Radio />}
            label="raw"
          />
        </RadioGroup>
        {bodyForm === BodyForm.Raw && (
          <Select
            size="small"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}>
            <MenuItem value={ContentType.Json}>JSON</MenuItem>
            <MenuItem value={ContentType.Text}>TEXT</MenuItem>
            <MenuItem value={ContentType.Xml}>XML</MenuItem>
          </Select>
        )}
      </Stack>
      <CodeMirror
        extensions={lang}
        hidden={bodyForm !== BodyForm.Raw}
        height="100px"
      />
    </Box>
  );
};

export default Body;
