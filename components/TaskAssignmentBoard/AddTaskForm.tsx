import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface AddTaskFormProps {
    onAddTask: (title: string) => void
}

export const AddTaskForm = ({ onAddTask }: AddTaskFormProps) => {
    const [newTaskTitle, setNewTaskTitle] = useState("")

    const handleSubmit = () => {
        if (!newTaskTitle.trim()) return
        onAddTask(newTaskTitle)
        setNewTaskTitle("")
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Task
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex gap-3">
                    <Input
                        placeholder="Enter task title..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit()
                            }
                        }}
                        className="flex-1"
                    />
                    <Button onClick={handleSubmit} disabled={!newTaskTitle.trim()}>
                        Add Task
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}