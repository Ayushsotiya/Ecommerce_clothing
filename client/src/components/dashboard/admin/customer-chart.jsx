"use client"

import React from "react"
import { TrendingUp } from "lucide-react"
import {
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
  Label,
  Tooltip,
} from "recharts"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

// Sample Data
const chartData = [{ month: "January", desktop: 1260, mobile: 570 }]
const totalVisitors = chartData[0].desktop + chartData[0].mobile

export function ChartRadialStacked() {
  return (
    <Card className="bg-[#1f1f1f] text-white border-white w-full max-w-md mx-auto">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-white">Radial Chart - Stacked</CardTitle>
        <CardDescription className="text-white opacity-70">
          January - June 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center items-center pb-0">
        <RadialBarChart
          width={250}
          height={150}
          innerRadius={60}
          outerRadius={100}
          data={chartData}
          startAngle={180}
          endAngle={0}
        >
          <PolarRadiusAxis
            type="number"
            domain={[0, totalVisitors]}
            tick={false}
            axisLine={false}
          >
            <Label
              position="center"
              content={({ viewBox }) => {
                const { cx, cy } = viewBox
                return (
                  <text x={cx} y={cy} textAnchor="middle">
                    <tspan
                      x={cx}
                      y={cy - 10}
                      className="fill-white text-2xl font-bold"
                    >
                      {totalVisitors.toLocaleString()}
                    </tspan>
                    <tspan
                      x={cx}
                      y={cy + 12}
                      className="fill-white text-sm opacity-70"
                    >
                      Visitors
                    </tspan>
                  </text>
                )
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            dataKey="desktop"
            stackId="a"
            fill="#ffffff"
            background
            cornerRadius={4}
          />
          <RadialBar
            dataKey="mobile"
            stackId="a"
            fill="#999999"
            cornerRadius={4}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#000", borderColor: "#fff", color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
        </RadialBarChart>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm text-white">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="opacity-70 leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
