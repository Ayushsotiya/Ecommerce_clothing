"use client"

import React, { useState, useEffect } from "react"
import { Users } from "lucide-react"
import { useSelector } from "react-redux"
import {
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
  Label,
} from "recharts"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

import { getTotalCustomers } from "../../../services/operations/analytic"

export function ChartRadialStacked() {
  const { token } = useSelector((state) => state.auth)
  const [totalCustomers, setTotalCustomers] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTotalCustomers(token)
      if (data) {
        setTotalCustomers(data.total)
      }
    }
    fetchData()
  }, [token])

  const chartData = [
    {
      name: "Customers",
      value: totalCustomers,
      fill: "#ffffff",
    },
  ]

  return (
    <Card className="bg-[#1f1f1f] text-white border-white w-full max-w-md mx-auto">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="h-4 w-4" /> Total Customers
        </CardTitle>
        <CardDescription className="text-white opacity-70">
          Real-time registered customer count
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center items-center pb-0">
        <RadialBarChart
          width={250}
          height={150}
          innerRadius={70}
          outerRadius={90}
          data={chartData}
          startAngle={180}
          endAngle={0}
        >
          <PolarRadiusAxis
            type="number"
            domain={[0, totalCustomers || 1]}
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
                      className="fill-white text-3xl font-bold"
                    >
                      {totalCustomers.toLocaleString()}
                    </tspan>
                    <tspan
                      x={cx}
                      y={cy + 12}
                      className="fill-white text-xs opacity-70"
                    >
                      Registered
                    </tspan>
                  </text>
                )
              }}
            />
          </PolarRadiusAxis>
          <RadialBar
            background
            dataKey="value"
            cornerRadius={5}
          />
        </RadialBarChart>
      </CardContent>
      <CardFooter className="justify-center text-sm text-white opacity-70 pt-0 pb-4">
        Showing total registered platform users
      </CardFooter>
    </Card>
  )
}
