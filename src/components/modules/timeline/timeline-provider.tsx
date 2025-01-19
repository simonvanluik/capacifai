"use client"

import * as React from "react"
// Import necessary table functionality from TanStack Table
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

// Import custom UI table components
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

// Define the props interface for the DataTable component
// TData represents the type of data in the table
// TValue represents the type of values in the columns
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]  // Base columns configuration
  data: TData[]                        // Data to be displayed in the table
  startDate?: Date                     // Starting date for the timeline (defaults to current date)
  numberOfWeeks?: number               // Number of weeks to display (defaults to 300)
}

export function DataTable<TData, TValue>({
  columns: baseColumns,
  data,
  startDate = new Date(),
  numberOfWeeks = 300,
}: DataTableProps<TData, TValue>) {
  // State management for table features
  const [rowSelection, setRowSelection] = React.useState({})              // Track selected rows
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    select: false,
    id: false,
    status: false,
    priority: false,
    title: true,
    actions: false,
  })                                                                      // Control column visibility
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])  // Store column filters
  const [sorting, setSorting] = React.useState<SortingState>([])         // Store sorting configuration

  // Generate week columns dynamically based on startDate and numberOfWeeks
  const weekColumns = React.useMemo(() => {
    const weeks = []
    const start = startOfWeek(startDate)

    for (let i = 0; i < numberOfWeeks; i++) {
      const weekDate = addWeeks(start, i)
      weeks.push({
        id: `week-${i}`,
        header: format(weekDate, 'w'),        // Display week number
        accessorKey: `week-${i}`,
        cell: () => (
          <div className="h-full w-full truncate">
            {/* Placeholder for week content */}
            
          </div>
        ),
      })
    }
    return weeks
  }, [startDate, numberOfWeeks])

  // Combine base columns with dynamically generated week columns
  const allColumns = React.useMemo(
    () => [...baseColumns, ...weekColumns],
    [baseColumns, weekColumns]
  )

  // Initialize the table with TanStack Table
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
    // Table feature models
    getCoreRowModel: getCoreRowModel(),           // Basic table functionality
    getFilteredRowModel: getFilteredRowModel(),   // Filtering support
    getSortedRowModel: getSortedRowModel(),       // Sorting support
    getFacetedRowModel: getFacetedRowModel(),     // Faceted data support
    getFacetedUniqueValues: getFacetedUniqueValues(), // Unique values for faceting
  })

  return (
    <div className="flex flex-col h-[600px] overflow-x-auto space-y-4 w-full">
      {/* Toolbar component for table controls */}
      <DataTableToolbar table={table} />

      <Table>
        {/* Header section with sticky positioning */}
        <TableHeader className="sticky top-0 z-20 bg-background">
          <TableRow>
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHead 
                    key={header.id}
                    // Make non-week columns sticky to the left
                    className="sticky left-0 top-0 z-30 bg-background w-[200px]" 
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>

        {/* Table body section */}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell 
                    key={cell.id}
                    // Apply different styling for week columns vs regular columns
                    className={`${
                      !cell.column.id.startsWith('week-')
                        ? "sticky left-0 z-10 bg-background w-[200px]" // Regular columns
                        : "p-0 w-[100px]"                             // Week columns
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Display when no data is available
            <TableRow>
              <TableCell colSpan={allColumns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}