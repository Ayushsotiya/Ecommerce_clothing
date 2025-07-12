import React from "react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample Revenue Data (in INR)
const revenueData = [
  { month: "January", revenue: 45000 },
  { month: "February", revenue: 52000 },
  { month: "March", revenue: 48000 },
  { month: "April", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "June", revenue: 67000 },
];

// Currency Formatter for INR
const formatINR = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

// Custom Tooltip for Revenue Chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-white p-1 rounded text-white text-xs">
        <p className="font-medium">Revenue</p>
        <p>{formatINR(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <Card className="bg-[#1c1c1c] border border-white text-white p-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Monthly Revenue</CardTitle>
        <CardDescription className="text-xs text-white opacity-70">
          Jan - Jun 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <LineChart
          data={revenueData}
          width={300}
          height={180}
          margin={{ left: 8, right: 8 }}
        >
          <CartesianGrid vertical={false} stroke="#ffffff20" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tick={{ fill: "#ffffff", fontSize: 10 }}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tick={{ fill: "#ffffff", fontSize: 10 }}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            dataKey="revenue"
            type="monotone"
            stroke="#ffffff"
            strokeWidth={2}
            dot={{ fill: "#ffffff", strokeWidth: 1.5, r: 3 }}
            activeDot={{
              r: 5,
              stroke: "#ffffff",
              strokeWidth: 1.5,
            }}
          />
        </LineChart>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-xs text-white pt-2">
        <div className="flex gap-1 font-medium leading-none">
          Trending up by 12.8% this month{" "}
          <TrendingUp className="h-3 w-3 text-white" />
        </div>
        <div className="leading-none opacity-70">
          Total revenue: {formatINR(328000)} in 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
