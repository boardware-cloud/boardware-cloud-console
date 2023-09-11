import React from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { MonitoringRecord, MonitoringResult } from "@boardware/argus-ts-sdk";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

interface IProps {
  records: MonitoringRecord[];
}

const DirectionStack: React.FC<IProps> = ({ records }) => {
  const statistic = React.useMemo(() => {
    let okRecords = records
      .filter((r) => r.result === MonitoringResult.Ok)
      .filter((_, index) => index < 10);
    okRecords.reverse();
    return okRecords;
  }, [records]);
  const averageResponseTime = React.useMemo(() => {
    const okRecords = statistic.filter((r) => r.result === MonitoringResult.Ok);
    return (
      okRecords.reduce((total, record) => record.responseTime! + total, 0) /
      okRecords.length
    );
  }, [statistic]);
  return <div></div>;
};
export default DirectionStack;
