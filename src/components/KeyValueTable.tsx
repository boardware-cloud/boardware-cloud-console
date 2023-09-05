import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  IconButton,
  Hidden,
} from "@mui/material";
import { Pair } from "argus-ts-sdk";
import React, { useEffect, useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface IPoprs {
  pairs: Pair[];
  setHeaders: React.Dispatch<React.SetStateAction<Pair[]>>;
}

const KeyValueTable: React.FC<IPoprs> = ({ pairs, setHeaders }) => {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const onChangeKey = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setHeaders((headers) => {
      return [...headers, { left: e.target.value, right: "" }];
    });
  };
  const onChangeValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setHeaders((headers) => {
      return [...headers, { left: "", right: e.target.value }];
    });
  };
  const setKey = (index: number, value: string) => {
    setHeaders((headers) => {
      headers[index].left = value;
      return [...headers];
    });
  };
  const setValue = (index: number, value: string) => {
    setHeaders((headers) => {
      headers[index].right = value;
      return [...headers];
    });
  };
  const DeleteKey = (index: number) => {
    setHeaders((headers) => {
      return headers.filter((_, i) => i !== index);
    });
  };
  return (
    <Table sx={{}} size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell align="left">Key</TableCell>
          <TableCell align="left">Value</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {pairs.map((pair, i) => {
          return (
            <TableRow
              onMouseLeave={() => setHoverIndex(-1)}
              onMouseOver={() => setHoverIndex(i)}
              key={i}>
              <TableCell align="left">
                <TextField
                  autoFocus={pair.left !== ""}
                  onChange={(e) => setKey(i, e.target.value)}
                  value={pair.left}
                  fullWidth
                  size="small"
                />
              </TableCell>
              <TableCell align="left">
                <TextField
                  autoFocus={pair.right !== ""}
                  onChange={(e) => setValue(i, e.target.value)}
                  fullWidth
                  value={pair.right}
                  size="small"
                />
              </TableCell>
              <TableCell align="left">
                <IconButton size="small" onClick={() => DeleteKey(i)}>
                  <DeleteForeverIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow key={pairs.length}>
          <TableCell align="left">
            <TextField
              onChange={onChangeKey}
              value={""}
              label="Key"
              fullWidth
              size="small"
            />
          </TableCell>
          <TableCell align="left">
            <TextField
              value={""}
              onChange={onChangeValue}
              label="Value"
              fullWidth
              size="small"
            />
          </TableCell>
          <TableCell width={10} align="left"></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default KeyValueTable;
