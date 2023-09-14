import { Account, Pagination } from "@boardware/core-ts-sdk";
import React, { useEffect, useMemo, useState } from "react";
import accountApi from "../../../../api/core";
import Table, { ColumnsIProps } from "../../../../components/Table";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import CopyButton from "../../../../components/CopyButton";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RoleTag from "../../../../components/RoleTag";

function DetailButton(onClick: () => void) {
  return (
    <Button onClick={onClick}>
      <ManageAccountsIcon></ManageAccountsIcon>
    </Button>
  );
}

const rowsPerPageOptions = [5, 10, 20, 25];

const Accounts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const nav = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    index: 0,
    total: 0,
    limit: 5,
  });

  const columns = useMemo(() => {
    return [
      { title: "Email", key: "email" },
      { title: "Role", key: "role" },
      {
        title: (
          <Button
            onClick={() => {
              nav("/dashboard/admin/users/create");
            }}>
            <PersonAddIcon />
          </Button>
        ),
        key: "detail",
        align: "right",
        size: "small",
        style: { width: 100 },
      },
    ] as Array<ColumnsIProps>;
  }, [accounts]);
  const rows = useMemo(
    () =>
      accounts.map((account) => ({
        key: account.id,
        columns: new Map<string, React.ReactNode>([
          ["email", <CopyButton text={account.email} />],
          ["role", RoleTag(account.role)],
          [
            "detail",
            DetailButton(() => nav("/dashboard/admin/users/" + account.id)),
          ],
        ]),
      })),
    [accounts]
  );
  const listAccount = (index: number, limit: number) => {
    accountApi.listAccount({ index, limit }).then((accountList) => {
      setAccounts(accountList.data);
      setPagination(accountList.pagination);
    });
  };
  useEffect(() => {
    listAccount(
      Number(searchParams.get("index")) || 0,
      Number(searchParams.get("limit")) || 5
    );
  }, [searchParams]);
  return Table({
    columns: columns,
    rows: rows,
    pagination: {
      rowsPerPageOptions: rowsPerPageOptions,
      page: pagination.index,
      count: pagination.total,
      rowsPerPage: pagination.limit,
      onPageChange: (_: any, index: number) => {
        setSearchParams({
          index: `${index}`,
          limit: `${Number(searchParams.get("limit")) || 5}`,
        });
      },
      onRowsPerPageChange: (limit: number) => {
        setSearchParams({
          index: `${Number(searchParams.get("index")) || 0}`,
          limit: `${limit}`,
        });
      },
    },
  });
};

export default Accounts;
