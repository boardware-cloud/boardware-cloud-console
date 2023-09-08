import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import accountApi from "../api/core";
import { ThemeProvider, createTheme } from "@mui/material";

const defaultTheme = createTheme();

function Root() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Outlet />
    </ThemeProvider>
  );
}

export default Root;
