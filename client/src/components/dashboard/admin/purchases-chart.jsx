import React from "react";
import { ShoppingCart } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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

// Sample Data
const purchaseData = [
  { month: "January", purchases: 1240 },
  { month: "February", purchases: 1450 },
  { month: "March", purchases: 1180 },
  { month: "April", purchases: 1680 },
  { month: "May", purchases: 1520 },
  { month: "June", purchases: 1890 },
];

// Tooltip content
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-white p-1 rounded text-white text-xs">
        <p className="font-medium">Purchases</p>
        <p>{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export function PurchasesChart() {
  return (
    <Card className="bg-[#1c1c1c] border-white text-white p-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Monthly Purchases</CardTitle>
        <CardDescription className="text-xs text-white opacity-70">
          Jan - Jun 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <BarChart
          data={purchaseData}
          margin={{ left: 8, right: 8 }}
          width={300}
          height={180}
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
            tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="purchases" fill="#ffffff" radius={[3, 3, 0, 0]} />
        </BarChart>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-xs text-white pt-2">
        <div className="flex gap-1 font-medium leading-none">
          Purchase volume up by 24.3% this month{" "}
          <ShoppingCart className="h-3 w-3 text-white" />
        </div>
        <div className="leading-none opacity-70">
          Total: 8,960 orders in 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
