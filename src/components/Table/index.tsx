import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TablePagination } from "@mui/material";

export interface ColumnsIProps {
  title?: React.ReactNode;
  key: string;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  size?: "small" | "medium";
  style?: React.CSSProperties;
}

interface IProps {
  columns: Array<ColumnsIProps>;
  rows: Array<Map<string, React.ReactNode>>;
  pagination?: {
    count: number;
    rowsPerPage: number;
    page: number;
    rowsPerPageOptions?:
      | (
          | number
          | {
              value: number;
              label: string;
            }
        )[]
      | undefined;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
      page: number
    ) => void;
    onRowsPerPageChange?: (limit: number) => void;
  };
}

export default function (props: IProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{}} aria-label="simple table">
        <TableHead>
          <TableRow>
            {props.columns.map((column) => (
              <TableCell style={column.style} key={column.key}>
                {column.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, i) => {
            return (
              <TableRow key={i}>
                {props.columns.map((column) => {
                  return (
                    <TableCell style={column.style} key={column.key}>
                      {row.get(column.key)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {props.pagination && (
        <TablePagination
          rowsPerPageOptions={props.pagination.rowsPerPageOptions}
          component="div"
          count={props.pagination.count}
          rowsPerPage={props.pagination.rowsPerPage}
          page={props.pagination.page}
          onPageChange={props.pagination.onPageChange}
          onRowsPerPageChange={(event) => {
            if (!props.pagination!.onRowsPerPageChange) return;
            const limit = parseInt(event.target.value, 10) || 0;
            props.pagination!.onRowsPerPageChange(limit);
          }}
        />
      )}
    </TableContainer>
  );
}
