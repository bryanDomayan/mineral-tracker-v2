"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PotableWaterGraphProps {
  data: any[];
}

export function PotableWaterGraph({ data }: PotableWaterGraphProps) {
  const chartData = data.map((item) => ({
    date: item.date ? new Date(item.date).toLocaleDateString() : "",
    cubicConsumed: item.cubicConsumed,
    bill: item.bill,
    department: item.Department?.name || "Unknown",
  }));

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Potable Water Consumption</CardTitle>
        <CardDescription>
          Cubic meters consumed and associated bills
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer
          config={{
            cubicConsumed: {
              label: "Cubic Meters",
              color: "hsl(var(--chart-1))",
            },
            bill: {
              label: "Bill",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="w-full h-[400px]" // Increased height for better visibility
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="var(--color-cubicConsumed)"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="var(--color-bill)"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="cubicConsumed"
                fill="var(--color-cubicConsumed)"
                name="Cubic Meters"
              />
              <Bar
                yAxisId="right"
                dataKey="bill"
                fill="var(--color-bill)"
                name="Bill"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
