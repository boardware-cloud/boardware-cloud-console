import { Divider } from "@mui/material";
import React from "react";

interface IProps {
  title: string;
}

const SectionTitle: React.FC<IProps> = ({ title }) => {
  return (
    <div>
      <h2>{title}</h2>
      <Divider></Divider>
    </div>
  );
};

export default SectionTitle;
