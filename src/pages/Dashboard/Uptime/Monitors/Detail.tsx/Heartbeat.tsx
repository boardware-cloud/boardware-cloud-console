import React, { useMemo } from "react";
import { MonitoringRecord, MonitoringResult } from "@boardware/argus-ts-sdk";
import ReactEcharts from "echarts-for-react";
import { Chip, FormControlLabel } from "@mui/material";

interface IProps {
  records: MonitoringRecord[];
}

const Heartbeat: React.FC<IProps> = ({ records }) => {
  const status = useMemo<"Unknow" | "Up" | "Down" | "Timeout">(() => {
    if (records.length === 0) return "Unknow";
    switch (records[0].result) {
      case MonitoringResult.Ok:
        return "Up";
      case MonitoringResult.Down:
        return "Down";
      case MonitoringResult.Timeout:
        return "Timeout";
    }
  }, [records]);
  const statistic = useMemo(() => {
    let okRecords = records
      .filter((r) => r.result === MonitoringResult.Ok)
      .filter((_, index) => index < 10);
    okRecords.reverse();
    return okRecords;
  }, [records]);
  const averageResponseTime = useMemo(() => {
    const okRecords = statistic.filter((r) => r.result === MonitoringResult.Ok);
    return (
      okRecords.reduce((total, record) => record.responseTime! + total, 0) /
      okRecords.length
    );
  }, [statistic]);
  const echartsOption = useMemo(() => {
    return {
      xAxis: {
        type: "category",
        data: statistic.map((r) => {
          const date = new Date(r.checkedAt);
          return `${date.getHours()}:${date.getMinutes()}`;
        }),
      },
      yAxis: {
        type: "value",
      },
      tooltip: {
        trigger: "axis",
      },
      series: [
        {
          data: statistic.map((r) => r.responseTime!),
          type: "line",
        },
      ],
    };
  }, [statistic]);
  return <ReactEcharts option={echartsOption} />;
};

export default Heartbeat;
