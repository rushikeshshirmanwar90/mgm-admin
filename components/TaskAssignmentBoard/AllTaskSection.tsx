import { Fragment } from "react"
import { Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Task, DragOverTarget } from './types'
import { TaskCard } from './TaskCard'
import { DropZone } from './DropZone'

interface AllTasksSectionProps {
    tasks: Task[]
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
}

export const AllTasksSection = ({
    tasks,
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
}: AllTasksSectionProps) => {
    return (
        <div className="lg:col-span-1">
            <Card className="h-fit w-[20rem]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        All Tasks
                        <Badge variant="secondary" className="text-xs">
                            {tasks.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent
                    className={`min-h-[300px] pb-6 ${dragOverTarget?.type === "all" ? "bg-blue-50 border-2 border-blue-400 border-dashed rounded" : ""} ${targetBoardId === "all" ? "bg-blue-50 transition-all duration-500" : ""}`}
                    onDragOver={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onDragOver({ type: "all", index: tasks.length })
                    }}
                    onDragLeave={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                            onDragLeave()
                        }
                    }}
                    onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onDrop("all", undefined, tasks.length)
                    }}
                >
                    <DropZone
                        type="all"
                        index={0}
                        isActive={dragOverTarget?.type === "all" && dragOverTarget?.index === 0}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                    />
                    {tasks.map((task, index) => (
                        <Fragment key={task.id}>
                            <div className={`mb-2 ${movingTaskId === task.id ? "opacity-50 scale-95 transition-all duration-500" : ""}`}>
                                <TaskCard
                                    task={task}
                                    sourceType="all"
                                    draggedTaskId={draggedTaskId}
                                    onDragStart={onDragStart}
                                    onDragEnd={onDragEnd}
                                    onDuplicate={onDuplicate}
                                    onDelete={onDelete}
                                />
                            </div>
                            <DropZone
                                type="all"
                                index={index + 1}
                                isActive={dragOverTarget?.type === "all" && dragOverTarget?.index === index + 1}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                            />
                        </Fragment>
                    ))}

                    {tasks.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            {dragOverTarget?.type === "all" ? "Drop task here" : "No tasks yet"}
                        </div>
                    )}

                    {/* Always visible drop zone at the bottom */}
                    <div
                        className={`mt-4 p-4 border-2 border-dashed rounded-lg transition-all ${dragOverTarget?.type === "all" && dragOverTarget?.index === tasks.length
                            ? "border-blue-400 bg-blue-50"
                            : "border-gray-200 bg-gray-50"
                            }`}
                        onDragOver={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onDragOver({ type: "all", index: tasks.length })
                        }}
                        onDrop={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onDrop("all", undefined, tasks.length)
                        }}
                    >
                        <div className="text-center text-sm text-gray-400">Drop tasks here</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}