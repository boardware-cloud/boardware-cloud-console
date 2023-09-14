import * as React from "react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import { mainListItems } from "./listItems";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { logout } from "../../utils/account";
import LogoutIcon from "@mui/icons-material/Logout";
import { Account, Role } from "@boardware/core-ts-sdk";
import { useSnackbar } from "notistack";
// Icon
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import NumbersIcon from "@mui/icons-material/Numbers";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const drawerWidth: number = 200;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export const AccountContext = React.createContext<Account | null>(null);

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const { account } = useLoaderData() as { account: Account };
  const { enqueueSnackbar } = useSnackbar();
  const nav = useNavigate();
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const showAccountMenu = Boolean(anchorEl);
  const singout = () => {
    enqueueSnackbar("Signout", { variant: "success" });
    logout();
    nav("/signin");
  };

  const role = React.useMemo(() => {
    if (!account) return Role.User;
    if (account.role !== Role.Root) return Role.User;
    return Role.Root;
  }, [account]);
  return (
    <AccountContext.Provider value={account}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px",
            }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}>
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}>
              Boardware Cloud Dashboard
            </Typography>
            <div>
              <IconButton
                aria-controls={showAccountMenu ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={showAccountMenu ? "true" : undefined}
                onClick={(event) => {
                  setAnchorEl(event.currentTarget);
                }}
                color="inherit">
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={showAccountMenu}
                onClose={() => {
                  setAnchorEl(null);
                }}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}>
                <MenuItem
                  onClick={() => {
                    enqueueSnackbar("Email Copied.", {
                      variant: "success",
                      preventDuplicate: true,
                    });
                    navigator.clipboard.writeText(account.email);
                  }}>
                  <ListItemIcon>
                    <AttachEmailIcon />
                  </ListItemIcon>
                  {account.email}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    enqueueSnackbar("ID Copied.", {
                      variant: "success",
                      preventDuplicate: true,
                    });
                    navigator.clipboard.writeText(account.id);
                  }}>
                  <ListItemIcon>
                    <NumbersIcon />
                  </ListItemIcon>
                  {account.id}
                </MenuItem>
                <Divider></Divider>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    nav("/dashboard/account/info");
                  }}>
                  <ListItemIcon>
                    <PersonOutlineIcon />
                  </ListItemIcon>
                  Account Information
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    nav("/dashboard/account/security");
                  }}>
                  <ListItemIcon>
                    <AddModeratorIcon />
                  </ListItemIcon>
                  Security
                </MenuItem>
                <Divider></Divider>
                <MenuItem onClick={singout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems({ role })}
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}>
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
            <Outlet></Outlet>
          </Container>
        </Box>
      </Box>
    </AccountContext.Provider>
  );
}
