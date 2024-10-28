"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { format } from "date-fns"; // for formatting dates

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Example chartConfig (for customizing colors, labels, etc.)
const chartConfig = {
  visitors: {
    label: "Average Temp",
  },
  week1: {
    label: "Week 1",
    color: "hsl(var(--chart-1))",
  },
  week2: {
    label: "Week 2",
    color: "hsl(var(--chart-2))",
  },
  week3: {
    label: "Week 3",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function PieGraph({ temperatureInWeek }: { temperatureInWeek: any[] }) {
  console.log("TEMPERATURE", temperatureInWeek);

  // Fallback to an empty array if temperatureInWeek is undefined or null
  const validData = temperatureInWeek || [];

  // Map temperature data into chart-compatible format based on createdAt date
  const chartData = validData.map((week: any, index: number) => ({
    createdAt: format(new Date(week.createdAt), "MMM dd"), // Format createdAt date
    averageTemp: week.average,
    fill: `hsl(var(--chart-${index + 1}))`, // dynamically assign colors
  }));

  // Calculate total average temperature over the data points
  const totalAverageTemp = React.useMemo(() => {
    if (chartData.length === 0) return 0; // handle division by zero case
    return (
      chartData.reduce((acc: any, curr: any) => acc + curr.averageTemp, 0) /
      chartData.length
    );
  }, [chartData]);

  return (
    <Card className="flex flex-col bg-transparent">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sun Temperature for this week</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="averageTemp"
              nameKey="createdAt"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalAverageTemp.toFixed(1)}°C
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Avg Temp for this week
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
