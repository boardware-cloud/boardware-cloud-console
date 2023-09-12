import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { Role } from "@boardware/core-ts-sdk";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import GroupIcon from "@mui/icons-material/Group";
const RouteButton: React.FC<{
  icon: JSX.Element;
  title: string;
  path?: string;
}> = ({ icon, title, path }) => {
  const navigate = useNavigate();
  return (
    <ListItemButton
      onClick={() => {
        if (path) {
          navigate(path);
        }
      }}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={title} />
    </ListItemButton>
  );
};

interface IProps {
  role: Role;
}

export function mainListItems(props: IProps) {
  return (
    <React.Fragment>
      {props.role === Role.Root && (
        <RouteButton
          icon={<GroupIcon />}
          path={"/dashboard/admin/users"}
          title={"Users"}
        />
      )}
      <RouteButton
        icon={<MonitorHeartIcon />}
        path={"/dashboard/uptime"}
        title={"Uptime"}
      />
    </React.Fragment>
  );
}
