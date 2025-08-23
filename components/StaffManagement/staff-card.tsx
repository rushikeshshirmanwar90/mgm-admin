"use client"

import { useRef } from "react"
import { Edit, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { StaffMember } from "@/hooks/useStaffManagement"

const colorOptions = [
  { value: "bg-blue-500", label: "Blue", preview: "#3b82f6" },
  { value: "bg-green-500", label: "Green", preview: "#10b981" },
  { value: "bg-purple-500", label: "Purple", preview: "#8b5cf6" },
  { value: "bg-orange-500", label: "Orange", preview: "#f97316" },
  { value: "bg-pink-500", label: "Pink", preview: "#ec4899" },
  { value: "bg-red-500", label: "Red", preview: "#ef4444" },
  { value: "bg-yellow-500", label: "Yellow", preview: "#eab308" },
  { value: "bg-indigo-500", label: "Indigo", preview: "#6366f1" },
  { value: "bg-teal-500", label: "Teal", preview: "#14b8a6" },
  { value: "bg-cyan-500", label: "Cyan", preview: "#06b6d4" },
  { value: "bg-emerald-500", label: "Emerald", preview: "#059669" },
  { value: "bg-violet-500", label: "Violet", preview: "#7c3aed" },
]

interface StaffCardProps {
  staff: StaffMember
  onEdit: (staff: StaffMember) => void
  onDelete: (staffId: string) => void
  onFileSelect: (files: FileList | null, staffId: string) => void
}

export default function StaffCard({ staff, onEdit, onDelete, onFileSelect }: StaffCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className={`${staff.color} text-white`}>
                {staff.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">{staff.name}</h3>
              <p className="text-sm text-gray-500">Team Member</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(staff)} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {staff.name}? This action cannot be undone.
                    {staff.tasks.length > 0 && (
                      <span className="block mt-2 text-amber-600 font-medium">
                        Warning: This staff member has {staff.tasks.length} assigned task(s).
                      </span>
                    )}
                    {staff.images.length > 0 && (
                      <span className="block mt-2 text-red-600 font-medium">
                        Warning: This will also delete {staff.images.length} uploaded image(s).
                      </span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(staff.id)} className="bg-red-600 hover:bg-red-700">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Assigned Tasks</span>
            <Badge variant="secondary">{staff.tasks.length}</Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Uploaded Images</span>
            <Badge variant="secondary">{staff.images.length}</Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Avatar Color</span>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{
                  backgroundColor: colorOptions.find((c) => c.value === staff.color)?.preview,
                }}
              />
              <span className="text-gray-700">{colorOptions.find((c) => c.value === staff.color)?.label}</span>
            </div>
          </div>

          {/* Upload Images Section - Only show if staff has assigned tasks */}
          {staff.tasks.length > 0 ? (
            <div className="pt-3 border-t">
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Task Images
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => onFileSelect(e.target.files, staff.id)}
                className="hidden"
              />
            </div>
          ) : (
            <div className="pt-3 border-t">
              <div className="text-center text-sm text-gray-500 py-2">
                <Upload className="h-4 w-4 mx-auto mb-1 opacity-50" />
                Assign tasks to enable image upload
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
