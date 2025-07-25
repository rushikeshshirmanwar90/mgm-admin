export interface Task {
  id: string;
  _id?: string; // MongoDB _id for backend operations
  title: string;
  description?: string;
  assignedTo?: string;
  originalId?: string; // Track if this is a duplicate
}

export interface StaffMember {
  _id?: string;
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}

export interface DragOverTarget {
  type: "all" | "staff";
  id?: string;
  index?: number;
}
