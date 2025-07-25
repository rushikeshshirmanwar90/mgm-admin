import { Task, StaffMember } from "./types";

export const initialTasks: Task[] = [
  { id: "1", title: "Design new landing page" },
  { id: "2", title: "Set up database schema" },
  { id: "3", title: "Write API documentation" },
  { id: "4", title: "Implement user authentication" },
  { id: "5", title: "Create dashboard components" },
  { id: "6", title: "Code review for payment system" },
  { id: "7", title: "Setup project repository" },
  { id: "8", title: "Initial project planning" },
];

export const initialStaffMembers: StaffMember[] = [
  {
    id: "john",
    name: "John Smith",
    color: "bg-blue-500",
    tasks: [],
  },
  {
    id: "sarah",
    name: "Sarah Johnson",
    color: "bg-green-500",
    tasks: [],
  },
  {
    id: "mike",
    name: "Mike Chen",
    color: "bg-purple-500",
    tasks: [],
  },
  {
    id: "emma",
    name: "Emma Davis",
    color: "bg-orange-500",
    tasks: [],
  },
  {
    id: "alex",
    name: "Alex Wilson",
    color: "bg-pink-500",
    tasks: [],
  },
];
