"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  const chartData = data.map((department, index) => ({
    department: department.name,
    totalConsumed: department.totalConsumed,
    fill: `hsl(${(index * 60) % 360}, 70%, 60%)`, // Generate a unique color for each department
  }));

  // Sort the chart data in descending order and slice the top 5 departments
  const topDepartments = React.useMemo(() => {
    return chartData
      .sort((a, b) => b.totalConsumed - a.totalConsumed)
      .slice(0, 5);
  }, [chartData]);

  // Find the highest number of totalConsumed among the top departments
  const highestConsumption = React.useMemo(() => {
    return Math.max(
      ...topDepartments.map((department) => department.totalConsumed)
    );
  }, [topDepartments]);

  // Find the name of the department with the highest consumption
  const highestDepartment = React.useMemo(() => {
    const departmentWithHighest = topDepartments.find(
      (department) => department.totalConsumed === highestConsumption
    );
    return departmentWithHighest ? departmentWithHighest.department : "";
  }, [highestConsumption, topDepartments]);

  return (
    <Card className="flex flex-col bg-transparent ">
      <CardHeader className="items-center pb-0">
        {" "}
        Top 5 departments with the highest water consumption{" "}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartData as any}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topDepartments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent hideLabel />} />
              <Legend />
              <Bar
                dataKey="totalConsumed"
                fill={topDepartments[0]?.fill || "#8884d8"}
              />
            </BarChart>
          </ResponsiveContainer>
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
