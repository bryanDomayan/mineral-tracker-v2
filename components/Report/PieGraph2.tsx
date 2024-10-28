"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DepartmentData {
  departmentId: number;
  name: string;
  information: string;
  totalConsumed: number;
}

export function PieGraph2({ data = [] }: { data?: DepartmentData[] }) {
  // Prevent map error when data is empty
  if (data.length === 0) {
    return <div>No data available</div>; // or a suitable placeholder
  }

  // Map the real data into the format needed for the chart
  const chartData = data.map((department) => ({
    browser: department.name,
    visitors: department.totalConsumed,
    fill: `var(--color-${department.name.toLowerCase()})`,
  }));

  // Sort the chart data in descending order and slice the top 5 departments
  const topDepartments = React.useMemo(() => {
    return chartData.sort((a, b) => b.visitors - a.visitors).slice(0, 5);
  }, [chartData]);

  // Create a configuration for the chart
  const chartConfig: Record<string, { label: string; color: string }> = {
    visitors: {
      label: "Visitors",
    } as any,
    ...topDepartments.reduce((acc, department, index) => {
      acc[department.browser.toLowerCase()] = {
        label: department.browser,
        color: `hsl(var(--chart-${index + 1}))`,
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>),
  };

  // Find the highest number of visitors among the top departments
  const highestVisitors = React.useMemo(() => {
    return Math.max(...topDepartments.map((department) => department.visitors));
  }, [topDepartments]);

  // Find the name of the department with the highest visitors
  const highestDepartment = React.useMemo(() => {
    const departmentWithHighest = topDepartments.find(
      (department) => department.visitors === highestVisitors
    );
    return departmentWithHighest ? departmentWithHighest.browser : "";
  }, [highestVisitors, topDepartments]);

  return (
    <Card className="flex flex-col bg-transparent ">
      <CardHeader className="items-center pb-0">
        {" "}
        Top 5 departments with the highest water consumption{" "}
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
              data={topDepartments}
              dataKey="visitors"
              nameKey="browser"
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
                          {highestVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {highestDepartment}
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {highestDepartment} is the highest consumption
          <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
