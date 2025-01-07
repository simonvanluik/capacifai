'use client'

import * as React from "react"
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Task, tasks } from "@/assets/timelineData"

function getWeeksBetween(start: Date, end: Date) {
  const weeks: string[] = []
  const current = new Date(start)
  
  while (current <= end) {
    // Get the Monday of current week
    const monday = new Date(current)
    monday.setDate(monday.getDate() - monday.getDay() + 1)
    
    weeks.push(`W${getISOWeek(monday)}`)
    
    // Move to next week
    current.setDate(current.getDate() + 7)
  }
  
  return weeks
}

function getISOWeek(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

function calculatePosition(date: string, startDate: Date, totalDays: number) {
  const taskDate = new Date(date)
  const days = (taskDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  return (days / totalDays) * 100
}

function StatusBadge({ status }: { status: Task['status'] }) {
  const colors = {
    'BACKLOG': 'bg-slate-500 hover:bg-slate-400',
    'IN PROGRESS': 'bg-blue-500 hover:bg-blue-400',
    'DONE': 'bg-green-500 hover:bg-green-400',
    'TO DO': 'bg-gray-500 hover:bg-gray-400',
  }

  return (
    <Badge className={`${colors[status]} text-white`}>
      {status}
    </Badge>
  )
}

export default function Timeline() {
  const startDate = new Date('2024-02-01')
  const endDate = new Date('2024-06-30')
  const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  const weeks = getWeeksBetween(startDate, endDate)

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        
        
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] sticky left-0 z-20 bg-background">Key</TableHead>
            <TableHead className="sticky left-[100px] z-20 bg-background">Issue</TableHead>
            
            <TableHead>
              <div className="flex justify-between px-2">
                {weeks.map(week => (
                  <span key={week} className="text-xs">
                    {week}
                  </span>
                ))}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>


        <TableBody>
          {tasks.map(task => (
            <TableRow key={task.id} className="group">
              
              <TableCell className="font-medium sticky left-0 z-10 bg-background">
                <div className="flex items-center gap-2">
                  <span>{task.key}</span>
                </div>
              </TableCell>
              
              <TableCell className="sticky left-[100px] z-10 bg-background">{task.title}</TableCell>
              
              <TableCell className="w-full">
                <div className="relative h-6">
                  <div className="absolute inset-0 flex">
                    {weeks.map((week) => (
                      <div
                        key={week}
                        className="flex-1 border-l border-border first:border-l-0"
                      >
                        <span className="sr-only">{week}</span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="absolute h-4 rounded bg-black"
                    style={{
                      left: `max(${calculatePosition(task.startDate, startDate, totalDays)}%, 0px)`,
                      width: `${
                        Math.min(calculatePosition(task.endDate, startDate, totalDays), 100) -
                        Math.max(calculatePosition(task.startDate, startDate, totalDays), 0)
                      }%`,
                    }}
                  />
                  {task.dependencies?.map((depId) => {
                    const dependency = tasks.find(t => t.id === depId)
                    if (!dependency) return null
                    
                    return (
                      <div
                        key={`${task.id}-${depId}`}
                        className="absolute h-2 w-2 rounded-full bg-blue-500"
                        style={{
                          left: `${calculatePosition(task.startDate, startDate, totalDays)}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    )
                  })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}