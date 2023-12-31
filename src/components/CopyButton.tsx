import { Button, Grow } from "@mui/material";
import React, { useEffect, useState } from "react";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import { useSnackbar } from "notistack";
interface IProps {
  text: string;
  startIcon?: React.ReactNode;
}

const CopyButton: React.FC<IProps> = ({ text, startIcon }) => {
  const [showCopyed, setShowCopyed] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const copy = () => {
    setShowCopyed(true);
    enqueueSnackbar("Copied.", {
      variant: "success",
      preventDuplicate: true,
    });
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (showCopyed) {
      setTimeout(() => {
        setShowCopyed(false);
      }, 3000);
    }
  }, [showCopyed]);
  return (
    <Button
      endIcon={
        <Grow
          in={showCopyed}
          style={{ transformOrigin: "0 0 0" }}
          {...(showCopyed ? { timeout: 250 } : {})}>
          <SpellcheckIcon></SpellcheckIcon>
        </Grow>
      }
      startIcon={startIcon}
      onClick={copy}
      style={{
        textTransform: "none",
      }}
      variant="text">
      {text}
    </Button>
  );
};

export default CopyButton;
