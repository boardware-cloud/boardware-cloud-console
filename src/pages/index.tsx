import { Outlet } from "react-router-dom";
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
