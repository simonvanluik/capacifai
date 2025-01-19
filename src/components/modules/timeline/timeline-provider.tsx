"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTableToolbar } from "./timeline-toolbar"
import { format, addWeeks, startOfWeek } from "date-fns"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  startDate?: Date
  numberOfWeeks?: number
}

export function DataTable<TData, TValue>({
  columns: baseColumns,
  data,
  startDate = new Date(),
  numberOfWeeks = 30,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    select: false,
    id: false,
    status: false,
    priority: false,
    title: true,
    actions: true,
  })
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const weekColumns = React.useMemo(() => {
    const weeks = []
    const start = startOfWeek(startDate)
    
    for (let i = 0; i < numberOfWeeks; i++) {
      const weekDate = addWeeks(start, i)
      weeks.push({
        id: `week-${i}`,
        header: format(weekDate, 'w'),
        accessorKey: `week-${i}`,
        cell: () => (
          <div className="h-full w-3 truncate">
            {/* add week content here*/}
          </div>
        ),
      })
    }
    return weeks
  }, [startDate, numberOfWeeks])

  const allColumns = React.useMemo(
    () => [...baseColumns, ...weekColumns],
    [baseColumns, weekColumns]
  )

  const table = useReactTable({
    data,
    columns: allColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="flex flex-col w-full space-y-4 bg-slate-50">

      <DataTableToolbar table={table} />

      <div className="flex flex-row rounded-md border">
        <div className="flex w-full">
          {/* Fixed Columns */}
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <React.Fragment key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const isWeekColumn = header.id.startsWith('week-')
                        if (isWeekColumn) return null
                        return (
                          <TableHead 
                            key={header.id}
                            className="h-12"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </React.Fragment>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const isWeekColumn = cell.column.id.startsWith('week-')
                        if (isWeekColumn) return null
                        return (
                          <TableCell 
                            key={cell.id}
                            className="h-[52px]"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))
                ) : null}
              </TableBody>
            </Table>
          </div>

          {/* Scrollable Week Columns */}
          <div className="flex flex-initial border-l overflow-x-auto w-full max-w-full bg-red-300">
            <Table>
              <TableHeader>
                <TableRow className="whitespace-nowrap">
                  {Array.from({ length: numberOfWeeks }, (_, i) => (
                    <TableHead key={`week-${i}`} className="h-12">
                      {i + 1}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="whitespace-nowrap">
                      {Array.from({ length: numberOfWeeks }, (_, i) => (
                        <TableCell 
                          key={`week-${i}`} 
                          className="h-[52px]"
                        >
                          {/* Content goes here */}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : null}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* No results row */}
        {!table.getRowModel().rows?.length && (
          <div className="h-24 text-center flex items-center justify-center">
            No results.
          </div>
        )}
      </div>
    </div>
  )
}