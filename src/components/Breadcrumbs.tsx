import React from "react";
import { Link, Breadcrumbs as MBreadcrumbs } from "@mui/material";
export interface Stack {
  label: string;
  to: string;
}

interface IProps {
  stacks: Stack[];
}

const Breadcrumbs: React.FC<IProps> = ({ stacks }) => {
  return (
    <MBreadcrumbs aria-label="breadcrumb">
      {stacks.map((stack, index) => {
        return (
          <Link key={index} underline="hover" color="inherit" href={stack.to}>
            {stack.label}
          </Link>
        );
      })}
    </MBreadcrumbs>
  );
};

export default Breadcrumbs;
