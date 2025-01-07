"use client"

import { columns } from "@/components/modules/timeline/columns"
import { DataTable } from "@/components/modules/timeline/timeline"
import { tasks } from "@/assets/timeline-data/schema"

export default function TasksPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks for this month
          </p>
        </div>
      </div>
      <DataTable data={tasks} columns={columns} />
    </div>
  )
}