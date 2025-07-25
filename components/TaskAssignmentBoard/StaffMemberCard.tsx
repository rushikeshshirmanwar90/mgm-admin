import { Fragment } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StaffMember, Task, DragOverTarget } from './types'
import { TaskCard } from './TaskCard'
import { DropZone } from './DropZone'

interface StaffMemberCardProps {
    staff: StaffMember
    draggedTaskId: string | null
    dragOverTarget: DragOverTarget | null
    movingTaskId: string | null
    targetBoardId: string | null
    onDragOver: (target: DragOverTarget) => void
    onDragLeave: () => void
    onDrop: (type: "all" | "staff", id?: string, index?: number) => void
    onDragStart: (task: Task) => void
    onDragEnd: () => void
    onDuplicate: (task: Task, sourceType: "all" | "staff", sourceId?: string) => void
    onDelete: (taskId: string, sourceType: "all" | "staff", sourceId?: string) => void
    onRemoveFromStaff?: (taskId: string, staffId: string) => void
}

export const StaffMemberCard = ({
    staff,
    draggedTaskId,
    dragOverTarget,
    movingTaskId,
    targetBoardId,
    onDragOver,
    onDragLeave,
    onDrop,
    onDragStart,
    onDragEnd,
    onDuplicate,
    onDelete,
    onRemoveFromStaff,
}: StaffMemberCardProps) => {
    return (
        <Card className="h-fit w-[19rem]">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className={`${staff.color} text-white text-sm`}>
                            {staff.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="font-medium text-sm">{staff.name}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        {staff.tasks.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent
                className={`min-h-[300px] pb-6 ${dragOverTarget?.type === "staff" && dragOverTarget?.id === staff.id
                    ? "bg-blue-50 border-2 border-blue-400 border-dashed rounded"
                    : ""
                    } ${targetBoardId === staff.id ? "bg-blue-50 transition-all duration-500" : ""}`}
                onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDragOver({ type: "staff", id: staff.id, index: staff.tasks.length })
                }}
                onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        onDragLeave()
                    }
                }}
                onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDrop("staff", staff.id, staff.tasks.length)
                }}
            >
                <DropZone
                    type="staff"
                    id={staff.id}
                    index={0}
                    isActive={
                        dragOverTarget?.type === "staff" &&
                        dragOverTarget?.id === staff.id &&
                        dragOverTarget?.index === 0
                    }
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                />
                {staff.tasks.map((task, index) => (
                    <Fragment key={task.id}>
                        <div className={`mb-2 ${movingTaskId === task.id ? "opacity-50 scale-95 transition-all duration-500" : ""}`}>
                            <TaskCard
                                task={task}
                                sourceType="staff"
                                sourceId={staff.id}
                                draggedTaskId={draggedTaskId}
                                onDragStart={onDragStart}
                                onDragEnd={onDragEnd}
                                onDuplicate={onDuplicate}
                                onDelete={onDelete}
                                onRemoveFromStaff={onRemoveFromStaff}
                            />
                        </div>
                        <DropZone
                            type="staff"
                            id={staff.id}
                            index={index + 1}
                            isActive={
                                dragOverTarget?.type === "staff" &&
                                dragOverTarget?.id === staff.id &&
                                dragOverTarget?.index === index + 1
                            }
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                        />
                    </Fragment>
                ))}

                {staff.tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        {dragOverTarget?.type === "staff" && dragOverTarget?.id === staff.id
                            ? "Drop task here"
                            : "No assigned tasks"}
                    </div>
                )}

                {/* Always visible drop zone at the bottom */}
                <div
                    className={`mt-4 p-4 border-2 border-dashed rounded-lg transition-all ${dragOverTarget?.type === "staff" &&
                        dragOverTarget?.id === staff.id &&
                        dragOverTarget?.index === staff.tasks.length
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                        }`}
                    onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onDragOver({ type: "staff", id: staff.id, index: staff.tasks.length })
                    }}
                    onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onDrop("staff", staff.id, staff.tasks.length)
                    }}
                >
                    <div className="text-center text-sm text-gray-400">Drop tasks here</div>
                </div>
            </CardContent>
        </Card >
    )
}