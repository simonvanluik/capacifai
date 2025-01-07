"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Task } from "@/assets/timeline-data/schema"
import { DataTableColumnHeader } from "./timeline-column-header"
import { DataTableRowActions } from "./timeline-row-actions"
import { ArrowUpIcon, ArrowDownIcon, CircleIcon } from 'lucide-react'
import { format, addWeeks, startOfWeek } from "date-fns"

export const COLUMN_WIDTHS = {
  select: 40,
  id: 80,
  title: 300,
  status: 100,
  priority: 120,
  actions: 40
} as const

export const TOTAL_COLUMN_WIDTH = Object.values(COLUMN_WIDTHS).reduce((a, b) => a + b, 0)

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    size: COLUMN_WIDTHS.select,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => (
      <div style={{ width: `${COLUMN_WIDTHS.id}px` }}>
        {row.getValue("id")}
      </div>
    ),
    size: COLUMN_WIDTHS.id,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const label = row.original.label

      return (
        <div className="flex space-x-2">
          <Badge variant="outline">{label}</Badge>
          <span 
            style={{ width: `${COLUMN_WIDTHS.title}px` }}
            className="truncate font-medium"
          >
            {row.getValue("title")}
          </span>
        </div>
      )
    },
    size: COLUMN_WIDTHS.title,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <div 
          style={{ width: `${COLUMN_WIDTHS.status}px` }}
          className="flex items-center"
        >
          {status === "done" && (
            <Badge className="bg-green-500">Done</Badge>
          )}
          {status === "in progress" && (
            <Badge variant="secondary">In Progress</Badge>
          )}
          {status === "todo" && (
            <Badge variant="outline">Todo</Badge>
          )}
          {status === "canceled" && (
            <Badge variant="destructive">Canceled</Badge>
          )}
          {status === "backlog" && (
            <Badge variant="outline">Backlog</Badge>
          )}
        </div>
      )
    },
    size: COLUMN_WIDTHS.status,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string

      return (
        <div className="flex items-center">
          {priority === "high" ? (
            <ArrowUpIcon className="mr-2 h-4 w-4 text-red-500" />
          ) : priority === "medium" ? (
            <CircleIcon className="mr-2 h-4 w-4 text-yellow-500" />
          ) : (
            <ArrowDownIcon className="mr-2 h-4 w-4 text-green-500" />
          )}
          <span className="capitalize">{priority}</span>
        </div>
      )
    },
    size: COLUMN_WIDTHS.priority,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    size: COLUMN_WIDTHS.actions,
  },
]