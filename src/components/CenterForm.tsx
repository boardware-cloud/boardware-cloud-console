import { Box, Container, LinearProgress, Paper } from "@mui/material";
import React from "react";

interface IProps {
  children?: JSX.Element | JSX.Element[];
  loading?: boolean;
}

const CenterForm: React.FC<IProps> = ({ children, loading }) => {
  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        height: `100%`,
      }}>
      <Box
        style={{
          margin: "auto",
          minWidth: 400,
        }}>
        {loading && (
          <LinearProgress
            style={{
              borderRadius: `100px 100px 0px 0px`,
            }}
          />
        )}
        <Paper
          style={{
            padding: 20,
          }}>
          {children}
        </Paper>
      </Box>
    </Container>
  );
};
export default CenterForm;
