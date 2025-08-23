import { useState, useRef, useMemo, useEffect } from "react";
import { Task, StaffMember, DragOverTarget } from "./types";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

// Helper to map API data to ensure id = _id || id for all tasks and staff
function mapApiData(tasksData: Task[], staffData: StaffMember[]) {
  const mappedTasks = tasksData.map((task) => ({
    ...task,
    id: task._id || task.id,
  }));
  const mappedStaff = staffData.map((staff) => ({
    ...staff,
    id: staff._id || staff.id,
    tasks: staff.tasks.map((task: Task) => ({
      ...task,
      id: task._id || task.id,
    })),
  }));
  return { mappedTasks, mappedStaff };
}

export const useTaskManagement = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<DragOverTarget | null>(
    null
  );
  const [movingTaskId, setMovingTaskId] = useState<string | null>(null);
  const [targetBoardId, setTargetBoardId] = useState<string | null>(null);
  const draggedTaskRef = useRef<string | null>(null);

  // Fetch all tasks and staff from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, staffRes] = await Promise.all([
          axiosInstance.get("/task"),
          axiosInstance.get("/staff"),
        ]);
        const { mappedTasks, mappedStaff } = mapApiData(
          tasksRes.data,
          staffRes.data
        );
        setAllTasks(mappedTasks);
        setStaffMembers(mappedStaff);
      } catch (error) {
        console.error("Failed to fetch tasks or staff", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter staff members based on search query
  const filteredStaffMembers = useMemo(() => {
    if (!searchQuery.trim()) return staffMembers;
    return staffMembers.filter((staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [staffMembers, searchQuery]);

  // Add a new task via API
  const addTask = async (title: string) => {
    try {
      const res = await axiosInstance.post("/task", { title });
      const newTask = { ...res.data, id: res.data._id || res.data.id };
      setAllTasks((prev) => [newTask, ...prev]);
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Failed to add task", error);
      toast.error("Failed to add task");
    }
  };

  // Delete a task via API
  const deleteTask = async (
    taskId: string,
    sourceType: "all" | "staff",
    staffId?: string
  ) => {
    return toast.promise(
      (async () => {
        let backendId = taskId;
        if (sourceType === "all") {
          const task = allTasks.find(
            (t) => t.id === taskId || t._id === taskId
          );
          backendId = task?._id || taskId;
          await axiosInstance.delete(`/task?taskId=${backendId}`);
        } else if (sourceType === "staff" && staffId) {
          // Find the staff member and task
          const staff = staffMembers.find((s) => s.id === staffId || s._id === staffId);
          if (!staff) {
            throw new Error("Staff member not found");
          }
          
          const task = staff.tasks.find(
            (t) => t.id === taskId || t._id === taskId
          );
          if (!task) {
            throw new Error("Task not found in staff member's tasks");
          }
          
          backendId = task._id || taskId;
          
          // Use the correct API endpoint to remove the task from staff
          await axiosInstance.put(`/staff?userId=${staff._id || staffId}`, {
            $pull: { tasks: { _id: backendId } },
          });
        }
        
        // Refresh state from backend
        const [tasksRes, staffRes] = await Promise.all([
          axiosInstance.get("/task"),
          axiosInstance.get("/staff"),
        ]);
        const { mappedTasks, mappedStaff } = mapApiData(
          tasksRes.data,
          staffRes.data
        );
        setAllTasks(mappedTasks);
        setStaffMembers(mappedStaff);
      })(),
      {
        pending: "Deleting task...",
        success: "Task deleted!",
        error: "Failed to delete task!",
      }
    );
  };

  // Duplicate a task via API
  const duplicateTask = async (task: Task) => {
    return toast.promise(
      (async () => {
        await axiosInstance.post("/task", { title: task.title });
        // Refresh state from backend
        const [tasksRes, staffRes] = await Promise.all([
          axiosInstance.get("/task"),
          axiosInstance.get("/staff"),
        ]);
        const { mappedTasks, mappedStaff } = mapApiData(
          tasksRes.data,
          staffRes.data
        );
        setAllTasks(mappedTasks);
        setStaffMembers(mappedStaff);
      })(),
      {
        pending: "Duplicating task...",
        success: "Task duplicated!",
        error: "Failed to duplicate task!",
      }
    );
  };

  // Find task by ID in either allTasks or staffMembers
  const findTask = (
    taskId: string
  ): {
    task: Task;
    source: "all" | "staff";
    staffId?: string;
    index: number;
  } | null => {
    // Try to find by _id first, then by id
    const allTaskIndex = allTasks.findIndex(
      (t) => t._id === taskId || t.id === taskId
    );
    if (allTaskIndex !== -1) {
      return {
        task: allTasks[allTaskIndex],
        source: "all",
        index: allTaskIndex,
      };
    }

    for (const staff of staffMembers) {
      const staffTaskIndex = staff.tasks.findIndex(
        (t) => t._id === taskId || t.id === taskId
      );
      if (staffTaskIndex !== -1) {
        return {
          task: staff.tasks[staffTaskIndex],
          source: "staff",
          staffId: staff.id,
          index: staffTaskIndex,
        };
      }
    }

    return null;
  };

  const handleDrop = async (
    targetType: "all" | "staff",
    targetId?: string,
    targetIndex?: number
  ) => {
    const taskId = draggedTaskRef.current;
    if (!taskId) return;

    const taskInfo = findTask(taskId);
    if (!taskInfo) return;

    const {
      task,
      source,
      staffId: sourceStaffId,
      index: sourceIndex,
    } = taskInfo;

    // Use _id for backend operations if present
    const backendId = task._id || task.id;

    // If dropping in the same position, do nothing
    if (
      source === targetType &&
      sourceStaffId === targetId &&
      (sourceIndex === targetIndex || sourceIndex === (targetIndex ?? 0) - 1)
    ) {
      return;
    }

    // Set the moving task ID and target board ID for visual feedback
    setMovingTaskId(taskId);
    setTargetBoardId(targetType === "all" ? "all" : targetId || null);

    await toast.promise(
      (async () => {
        try {
          if (targetType === "staff" && targetId) {
            const targetStaff = staffMembers.find(s => s.id === targetId || s._id === targetId);
            if (!targetStaff) {
              throw new Error("Target staff member not found");
            }
            const targetStaffId = targetStaff._id || targetId;
            
            // Moving from All Tasks to Staff
            if (source === "all") {
              await axiosInstance.delete(`/task?taskId=${backendId}`);
              await axiosInstance.put(`/staff?userId=${targetStaffId}`, {
                $push: { tasks: { ...task, assignedTo: targetStaffId } },
              });
            }
            // Moving from one staff to another
            else if (
              source === "staff" &&
              sourceStaffId &&
              sourceStaffId !== targetId
            ) {
              const sourceStaff = staffMembers.find(s => s.id === sourceStaffId || s._id === sourceStaffId);
              if (!sourceStaff) {
                throw new Error("Source staff member not found");
              }
              const sourceStaffBackendId = sourceStaff._id || sourceStaffId;
              
              await axiosInstance.put(`/staff?userId=${sourceStaffBackendId}`, {
                $pull: { tasks: { _id: backendId } },
              });
              await axiosInstance.put(`/staff?userId=${targetStaffId}`, {
                $push: { tasks: { ...task, assignedTo: targetStaffId } },
              });
            }
          } else if (targetType === "all") {
            // Moving from staff to All Tasks
            if (source === "staff" && sourceStaffId) {
              const sourceStaff = staffMembers.find(s => s.id === sourceStaffId || s._id === sourceStaffId);
              if (!sourceStaff) {
                throw new Error("Source staff member not found");
              }
              const sourceStaffBackendId = sourceStaff._id || sourceStaffId;
              
              await axiosInstance.put(`/staff?userId=${sourceStaffBackendId}`, {
                $pull: { tasks: { _id: backendId } },
              });
              await axiosInstance.post(`/task`, { title: task.title });
            }
          }
        } catch (error) {
          console.error("Failed to update task assignment:", error);
          throw error;
        }
        // After backend update, re-fetch data
        const [tasksRes, staffRes] = await Promise.all([
          axiosInstance.get("/task"),
          axiosInstance.get("/staff"),
        ]);
        const { mappedTasks, mappedStaff } = mapApiData(
          tasksRes.data,
          staffRes.data
        );
        setAllTasks(mappedTasks);
        setStaffMembers(mappedStaff);
      })(),
      {
        pending: "Updating task...",
        success: "Task updated!",
        error: "Failed to update task!",
      }
    );

    // Reset states after the operation is complete
    draggedTaskRef.current = null;
    setDraggedTaskId(null);
    setDragOverTarget(null);
    setMovingTaskId(null);
    setTargetBoardId(null);
  };

  const handleDragStart = (task: Task) => {
    const dragId = task._id || task.id;
    draggedTaskRef.current = dragId;
    setTimeout(() => setDraggedTaskId(dragId), 0);
  };

  const handleDragEnd = () => {
    draggedTaskRef.current = null;
    setDraggedTaskId(null);
    setDragOverTarget(null);
  };

  // Remove a task from staff and move to allTasks (DB update)
  const removeTaskFromStaff = async (taskId: string, staffId: string) => {
    // Set the moving task ID and target board ID for visual feedback
    setMovingTaskId(taskId);
    setTargetBoardId("all");

    await toast.promise(
      (async () => {
        try {
          // Find the staff and task to get _id
          const staff = staffMembers.find((s) => s.id === staffId || s._id === staffId);
          if (!staff) {
            throw new Error("Staff member not found");
          }
          
          const task = staff.tasks.find(
            (t) => t.id === taskId || t._id === taskId
          );
          if (!task) {
            throw new Error("Task not found in staff member's tasks");
          }
          
          const backendId = task._id || taskId;
          const staffBackendId = staff._id || staffId;
          
          // Remove from staff in DB
          await axiosInstance.put(`/staff?userId=${staffBackendId}`, {
            $pull: { tasks: { _id: backendId } },
          });
          
          // Add to allTasks in DB
          await axiosInstance.post(`/task`, { title: task.title });
          
          // Refresh state
          const [tasksRes, staffRes] = await Promise.all([
            axiosInstance.get("/task"),
            axiosInstance.get("/staff"),
          ]);
          const { mappedTasks, mappedStaff } = mapApiData(
            tasksRes.data,
            staffRes.data
          );
          setAllTasks(mappedTasks);
          setStaffMembers(mappedStaff);
        } catch (error) {
          console.error("Failed to remove task from staff:", error);
          throw error;
        } finally {
          // Reset states after the operation is complete
          setMovingTaskId(null);
          setTargetBoardId(null);
        }
      })(),
      {
        pending: "Updating task...",
        success: "Task updated!",
        error: "Failed to update task!",
      }
    );
  };

  return {
    allTasks,
    staffMembers,
    filteredStaffMembers,
    searchQuery,
    setSearchQuery,
    draggedTaskId,
    dragOverTarget,
    setDragOverTarget,
    movingTaskId,
    targetBoardId,
    addTask,
    deleteTask,
    duplicateTask,
    handleDrop,
    handleDragStart,
    handleDragEnd,
    removeTaskFromStaff,
    loading,
  };
};
