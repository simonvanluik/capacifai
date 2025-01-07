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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

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
  numberOfWeeks = 12,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
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
          <div className="w-[120px] h-full">
            {/* Week content here */}
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

  // Calculate fixed columns width
  const fixedColumnsWidth = React.useMemo(() => {
    return {
      select: 40,
      id: 80,
      title: 700,
      status: 100,
      priority: 100,
      actions: 40,
    }
  }, [])

  const totalFixedWidth = Object.values(fixedColumnsWidth).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-col space-y-4 w-full">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <div className="flex">

          {/* Fixed columns section - no scroll */}
          <div className="w-fit">
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

          {/* Scrollable week columns section */}
          <div className="relative border-l border-border overflow-hidden w-full">
            <ScrollArea className="w-full">
              <div className={`w-[calc(100vw - ${totalFixedWidth}px)]`}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <React.Fragment key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            const isWeekColumn = header.id.startsWith('week-')
                            if (!isWeekColumn) return null
                            return (
                              <TableHead 
                                key={header.id}
                                className="h-12 w-[120px]"
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
                            if (!isWeekColumn) return null
                            return (
                              <TableCell 
                                key={cell.id}
                                className="h-[52px] w-[120px]"
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
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={weekColumns.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}