"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 132,
  },
  {
    name: "Feb",
    total: 156,
  },
  {
    name: "Mar",
    total: 178,
  },
  {
    name: "Apr",
    total: 201,
  },
  {
    name: "May",
    total: 187,
  },
  {
    name: "Jun",
    total: 220,
  },
  {
    name: "Jul",
    total: 245,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip
          cursor={{ fill: "rgba(180, 199, 231, 0.1)" }}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
          formatter={(value: number) => [`${value} runs`, "Total"]}
          labelFormatter={(label) => `${label}`}
        />
        <Bar dataKey="total" fill="#0f6dd1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
