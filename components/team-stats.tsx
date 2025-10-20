"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "Data Team",
    automations: 87,
    success: 82,
  },
  {
    name: "DevOps",
    automations: 65,
    success: 61,
  },
  {
    name: "Security",
    automations: 42,
    success: 40,
  },
  {
    name: "Frontend",
    automations: 34,
    success: 33,
  },
  {
    name: "Backend",
    automations: 29,
    success: 27,
  },
]

export function TeamStats() {
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
        />
        <Legend />
        <Bar dataKey="automations" name="Total Runs" fill="#0f6dd1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="success" name="Successful" fill="#b4c7e7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
