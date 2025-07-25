import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Task } from './types'

interface TaskCardProps {
    task: Task
    sourceType: "all" | "staff"
    sourceId?: string
    draggedTaskId: string | null
    onDragStart: (task: Task) => void
    onDragEnd: () => void
    onDuplicate: (task: Task, sourceType: "all" | "staff", sourceId?: string) => void
    onDelete: (taskId: string, sourceType: "all" | "staff", sourceId?: string) => void
    onRemoveFromStaff?: (taskId: string, staffId: string) => void
}

export const TaskCard = ({
    task,
    sourceType,
    sourceId,
    draggedTaskId,
    onDragStart,
    onDragEnd,
    onDuplicate,
    onDelete,
    onRemoveFromStaff,
}: TaskCardProps) => {
    // Only show Remove if onRemoveFromStaff is present and sourceType is staff
    const showRemove = sourceType === "staff" && typeof onRemoveFromStaff === "function" && !!sourceId;
    return (
        <div
            className={`group hover:shadow-md transition-all cursor-grab active:cursor-grabbing bg-white rounded-lg border ${draggedTaskId === task.id ? "opacity-50 scale-105" : ""
                }`}
            draggable={true}
            onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move"
                e.dataTransfer.setData("text/plain", task.id)
                onDragStart(task)
            }}
            onDragEnd={onDragEnd}
        >
            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-sm text-gray-900">{task.title}</h3>
                            {task.originalId && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                    Copy
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                >
                                    <MoreHorizontal className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {showRemove ? (
                                    <DropdownMenuItem
                                        onClick={() => onRemoveFromStaff && onRemoveFromStaff(task.id, sourceId)}
                                        className="text-blue-600"
                                    >
                                        Remove
                                    </DropdownMenuItem>
                                ) : (
                                    <>
                                        <DropdownMenuItem onClick={() => onDuplicate(task, sourceType, sourceId)} className="text-blue-600">
                                            Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDelete(task.id, sourceType, sourceId)} className="text-red-600">
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    )
}