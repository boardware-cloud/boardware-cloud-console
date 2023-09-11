import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";

interface IProps {
  text: string;
  startIcon?: React.ReactNode;
}

const CopyButton: React.FC<IProps> = ({ text, startIcon }) => {
  const [showCopyed, setShowCopyed] = useState(false);
  useEffect(() => {
    if (showCopyed) {
      setTimeout(() => {
        setShowCopyed(false);
      }, 3000);
    }
  }, [showCopyed]);
  return (
    <Button
      endIcon={showCopyed && <SpellcheckIcon></SpellcheckIcon>}
      startIcon={startIcon}
      onClick={() => {
        setShowCopyed(true);
        navigator.clipboard.writeText(text);
      }}
      style={{}}
      variant="text">
      {text}
    </Button>
  );
};

export default CopyButton;
