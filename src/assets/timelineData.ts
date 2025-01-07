export interface Task {
  id: string
  key: string
  title: string
  startDate: string
  endDate: string
  status: "BACKLOG" | "IN PROGRESS" | "DONE" | "TO DO"
  dependencies?: string[]
}

export const tasks: Task[] = [
  {
    id: "1",
    key: "PM-4",
    title: "Intelligent travel suggestions",
    startDate: "2024-02-03",
    endDate: "2024-04-03",
    status: "BACKLOG",
  },
  {
    id: "2",
    key: "PM-1",
    title: "Team Travel Mobile Apps",
    startDate: "2024-02-03",
    endDate: "2024-07-24",
    status: "IN PROGRESS",
  },
  {
    id: "ios-1",
    key: "IOS-1",
    title: "App Basics - iOS",
    startDate: "2024-03-01",
    endDate: "2024-04-02",
    status: "IN PROGRESS",
  },
  {
    id: "ios-9",
    key: "IOS-9",
    title: "Trip management",
    startDate: "2024-01-06",
    endDate: "2024-02-28",
    status: "DONE",
    dependencies: ["ios-1"],
  },
  {
    id: "adr-1",
    key: "ADR-1",
    title: "App Basics - Android",
    startDate: "2024-02-17",
    endDate: "2024-03-20",
    status: "TO DO",
  },
] 