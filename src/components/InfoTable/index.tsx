import { Grid, Typography } from "@mui/material";
import React from "react";
import { Pair } from "../../model/models";
import SectionTitle from "../SectionTitle";

interface IProps {
  title?: string;
  items?: Pair<React.ReactNode, React.ReactNode>[];
}

const InfoTable: React.FC<IProps> = ({ title, items = [] }) => {
  return (
    <Grid container spacing={2}>
      {title && (
        <Grid item xs={12}>
          <SectionTitle title={title}></SectionTitle>
        </Grid>
      )}
      {items.map((item, i) => {
        return (
          <React.Fragment key={i}>
            <Grid item xs={6}>
              {item.left}
            </Grid>
            <Grid item xs={6}>
              {item.right}
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
  );
};

export default InfoTable;
