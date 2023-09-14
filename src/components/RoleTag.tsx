import { Role } from "@boardware/core-ts-sdk";
import { Tag } from "antd";

export default function RoleTag(role: Role) {
  switch (role) {
    case Role.Admin:
      return <Tag color="#55acee">Admin</Tag>;
    case Role.Root:
      return <Tag color="#3b5999">Root</Tag>;
  }
  return <Tag color="#55acee">User</Tag>;
}
