import React from "react";
import { MonitoringRecord, MonitoringResult } from "@boardware/argus-ts-sdk";

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
