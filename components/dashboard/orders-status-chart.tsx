"use client";

import { DonutChart } from "@tremor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrdersStatusChartProps {
  data: { status: string; count: number }[];
}

const statusColors: Record<string, string> = {
  new: "blue",
  assigned: "yellow",
  scheduled: "purple",
  in_progress: "orange",
  in_review: "indigo",
  revisions: "amber",
  completed: "green",
  delivered: "slate",
  cancelled: "red",
};

export function OrdersStatusChart({ data }: OrdersStatusChartProps) {
  const chartData = data.map((item) => ({ name: item.status.replace(/_/g, " "), count: item.count }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by status</CardTitle>
      </CardHeader>
      <CardContent>
        <DonutChart
          data={chartData}
          category="count"
          index="name"
          valueFormatter={(value) => value.toString()}
          className="mx-auto h-60"
          colors={chartData.map((item) => statusColors[item.name.replace(/ /g, "_")] ?? "blue")}
        />
      </CardContent>
    </Card>
  );
}
