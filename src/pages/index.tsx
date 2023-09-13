import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";

const defaultTheme = createTheme();

function Root() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <SnackbarProvider maxSnack={5} preventDuplicate>
        <Outlet />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default Root;
