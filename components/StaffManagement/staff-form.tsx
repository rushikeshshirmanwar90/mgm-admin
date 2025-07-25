"use client"

import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

interface StaffFormProps {
  formName: string
  setFormName: (name: string) => void
  formColor: string
  setFormColor: (color: string) => void
  editingStaff: StaffMember | null
  onSubmit: () => void
  onCancel: () => void
}

export default function StaffForm({
  formName,
  setFormName,
  formColor,
  setFormColor,
  editingStaff,
  onSubmit,
  onCancel,
}: StaffFormProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
          </span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            ✕
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="staffName" className="text-sm font-medium text-gray-700">
              Staff Name *
            </label>
            <Input
              id="staffName"
              type="text"
              placeholder="Enter staff member name..."
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && formName.trim()) {
                  e.preventDefault()
                  onSubmit()
                }
                if (e.key === "Escape") {
                  e.preventDefault()
                  onCancel()
                }
              }}
              className="w-full"
              autoFocus
              autoComplete="off"
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Avatar Color</label>
            <div className="grid grid-cols-6 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormColor(color.value)}
                  className={`relative w-12 h-12 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formColor === color.value
                      ? "border-gray-900 ring-2 ring-gray-300"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color.preview }}
                  title={color.label}
                  aria-label={`Select ${color.label} color`}
                >
                  {formColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Preview</label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={`${formColor} text-white`}>
                  {formName
                    .trim()
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{formName.trim() || "Staff Name"}</div>
                <div className="text-xs text-gray-500">Team Member</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button onClick={onSubmit} disabled={!formName.trim()} className="flex-1" type="button">
              {editingStaff ? "Update Staff Member" : "Add Staff Member"}
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent" type="button">
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
