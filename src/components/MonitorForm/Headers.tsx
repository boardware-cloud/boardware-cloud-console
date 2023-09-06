import React, { useState } from "react";
import KeyValueTable from "../KeyValueTable";
import { Pair } from "@boardware/argus-ts-sdk";

interface IProps {
  show?: boolean;
  headers: Pair[];
  setHeaders: React.Dispatch<React.SetStateAction<Pair[]>>;
}

const Headers: React.FC<IProps> = ({ headers, setHeaders }) => {
  return (
    <KeyValueTable setHeaders={setHeaders} pairs={headers}></KeyValueTable>
  );
};

export default Headers;
