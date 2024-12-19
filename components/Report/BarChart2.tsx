"use client";

import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

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

const chartConfig = {
  temperature: {
    label: "temperature",
    color: "hsl(var(--chart-1))",
  },
  consumption: {
    label: "consumption",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function Bargraph2({
  data: { consumedTemperature, departmentLabel },
}: {
  data: { consumedTemperature: any; departmentLabel: string };
}) {
  const months = [
    { month: "January", temperature: 0, consumption: 0 },
    { month: "February", temperature: 0, consumption: 0 },
    { month: "March", temperature: 0, consumption: 0 },
    { month: "April", temperature: 0, consumption: 0 },
    { month: "May", temperature: 0, consumption: 0 },
    { month: "June", temperature: 0, consumption: 0 },
    { month: "July", temperature: 0, consumption: 0 },
    { month: "August", temperature: 0, consumption: 0 },
    { month: "September", temperature: 0, consumption: 0 },
    { month: "October", temperature: 0, consumption: 0 },
    { month: "November", temperature: 0, consumption: 0 },
    { month: "December", temperature: 0, consumption: 0 },
  ];

  // Initialize an array to hold the count of entries for average temperature calculation
  const temperatureCounts = new Array(12).fill(0);

  // Iterate through the data (consumedTemperature)
  consumedTemperature.forEach((entry: any) => {
    const createdAt = new Date(entry.createdAt);
    const monthIndex = createdAt.getMonth(); // Get the month index (0-11)

    // Accumulate consumption
    months[monthIndex].consumption += entry.totalConsumed;

    // Check if entry.Temperature exists and is valid
    if (entry.Temperature && entry.Temperature.average !== undefined) {
      months[monthIndex].temperature += entry.Temperature.average;
      temperatureCounts[monthIndex]++; // Increment the count for the month
    }
  });

  // Calculate the average temperature for each month
  months.forEach((month, index) => {
    if (temperatureCounts[index] > 0) {
      month.temperature /= temperatureCounts[index]; // Average the temperature
    } else {
      month.temperature = 0; // Set to 0 if there are no entries
    }
  });

  // Final formatted data
  const formattedData = months;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <p className="text-teal-700">
              Statistics of total mineral consumed based on the heat of the sun
            </p>
          </CardTitle>
          <CardDescription>
            Sun and total consumption of {departmentLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              data={formattedData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                domain={[0, "auto"]} // Ensures the y-axis starts at 0
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="consumption"
                fill="var(--color-consumption)"
                barSize={30}
              />
              <Bar
                dataKey="temperature"
                fill="var(--color-temperature)"
                barSize={30}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
