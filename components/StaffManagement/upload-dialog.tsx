"use client"

import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Task } from "../TaskAssignmentBoard/types"
import { StaffMember } from "@/hooks/useStaffManagement"

interface UploadDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedStaff: StaffMember | null
  selectedTaskId: string
  onTaskSelect: (taskId: string) => void
  onConfirm: () => void
}

export default function UploadDialog({
  isOpen,
  onClose,
  selectedStaff,
  selectedTaskId,
  onTaskSelect,
  onConfirm,
}: UploadDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Select Task for Images
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {selectedStaff?.name} has multiple tasks assigned. Please select which task these images belong to:
          </p>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Task *</label>
            <Select value={selectedTaskId} onValueChange={onTaskSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a task..." />
              </SelectTrigger>
              <SelectContent>
                {selectedStaff?.tasks.map((task : Task) => (
                  <SelectItem key={task.id} value={task.id}>
                    <div className="flex items-center gap-2">
                      <span>{task.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onConfirm} disabled={!selectedTaskId} className="flex-1">
              Upload Images
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
