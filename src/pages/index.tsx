import { Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import { SnackbarProvider } from "notistack";

const defaultTheme = createTheme();

function Root() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <SnackbarProvider autoHideDuration={2500} maxSnack={5} preventDuplicate>
        <Outlet />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default Root;
