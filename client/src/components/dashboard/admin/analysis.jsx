import React from 'react'
import { RevenueChart } from "./revenue-chart"
import { PurchasesChart } from "./purchases-chart"
import {ChartRadialStacked} from "./customer-chart";
const Analysis = () => {
  return (
    <div className="min-h-screen w-full pt-20 bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Business Analytics Dashboard</h1>
          <p className="text-gray-400">Track your revenue and purchase trends</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          <RevenueChart />
          <PurchasesChart />
          <ChartRadialStacked/>
        </div>
      </div>
    </div>
  )
}

export default Analysis