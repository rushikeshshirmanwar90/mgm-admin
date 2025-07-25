"use client"

import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axiosInstance"
import { toast } from "react-toastify"
import { Plus, Edit, Trash2, Users, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Task } from "@/components/TaskAssignmentBoard/types"

interface StaffMember {
    id: string
    name: string
    color: string
    tasks: Task[]
}

interface StaffManagementProps {
    onBack: () => void
}

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

export default function StaffManagement({ onBack }: StaffManagementProps) {
    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
    const [formName, setFormName] = useState("")
    const [formColor, setFormColor] = useState("bg-blue-500")

    // Fetch staff from API
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await axiosInstance.get("/staff")
                setStaffMembers(res.data)
            } catch (err) {
                console.error("Failed to fetch staff:", err)
                toast.error("Failed to load staff members")
            } finally {
                setLoading(false)
            }
        }
        fetchStaff()
    }, [])

    const resetForm = () => {
        setFormName("")
        setFormColor("bg-blue-500")
        setShowAddForm(false)
        setEditingStaff(null)
        setTimeout(() => {
            const input = document.getElementById("staffName") as HTMLInputElement
            if (input) {
                input.value = ""
                input.focus()
            }
        }, 0)
    }

    const handleAdd = async () => {
        if (!formName.trim()) return
        try {
            await toast.promise(
                axiosInstance.post("/staff", { name: formName, color: formColor }),
                {
                    pending: "Adding staff member...",
                    success: "Staff member added!",
                    error: "Failed to add staff member!"
                }
            )
            const res = await axiosInstance.get("/staff")
            setStaffMembers(res.data)
            resetForm()
        } catch (err) {
            console.error("Failed to add staff:", err)
        }
    }

    const handleEdit = (staff: StaffMember) => {
        setEditingStaff(staff)
        setFormName(staff.name)
        setFormColor(staff.color)
        setShowAddForm(true)
        setTimeout(() => {
            const input = document.getElementById("staffName") as HTMLInputElement
            if (input) {
                input.focus()
                input.select()
            }
        }, 100)
    }

    const handleUpdate = async () => {
        if (!formName.trim() || !editingStaff) return
        try {
            await toast.promise(
                axiosInstance.put(`/staff?userId=${editingStaff.id}`, { name: formName, color: formColor }),
                {
                    pending: "Updating staff member...",
                    success: "Staff member updated!",
                    error: "Failed to update staff member!"
                }
            )
            const res = await axiosInstance.get("/staff")
            setStaffMembers(res.data)
            resetForm()
        } catch (err) {
            console.error("Failed to update staff:", err)
        }
    }

    const handleDelete = async (staffId: string) => {
        try {
            await toast.promise(
                axiosInstance.delete(`/staff?userId=${staffId}`),
                {
                    pending: "Deleting staff member...",
                    success: "Staff member deleted!",
                    error: "Failed to delete staff member!"
                }
            )
            const res = await axiosInstance.get("/staff")
            setStaffMembers(res.data)
        } catch (err) {
            console.error("Failed to delete staff:", err)
        }
    }

    const StaffForm = () => (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
                    </span>
                    <Button variant="ghost" size="sm" onClick={resetForm}>
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
                            onChange={(e) => {
                                console.log("Input changed:", e.target.value) // Debug log
                                setFormName(e.target.value)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && formName.trim()) {
                                    e.preventDefault()
                                    {editingStaff ? handleUpdate() : handleAdd()}
                                }
                                if (e.key === "Escape") {
                                    e.preventDefault()
                                    resetForm()
                                }
                            }}
                            className="w-full"
                            autoFocus
                            autoComplete="off"
                        />
                        {formName.trim() === "" && <p className="text-xs text-gray-500">Please enter a staff member name</p>}
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
                                    className={`relative w-12 h-12 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 ${formColor === color.value
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
                        <Button
                            onClick={editingStaff ? handleUpdate : handleAdd}
                            disabled={!formName.trim()}
                            className="flex-1"
                            type="button"
                        >
                            {editingStaff ? "Update Staff Member" : "Add Staff Member"}
                        </Button>
                        <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent" type="button">
                            Cancel
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen text-lg">Loading staff members...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="outline" onClick={onBack} className="flex items-center gap-2 bg-transparent">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Board
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
                    <p className="text-gray-600">Manage your team members • Add, edit, or remove staff</p>
                </div>

                {/* Add Staff Button */}
                {!showAddForm && (
                    <Button onClick={() => setShowAddForm(true)} className="mb-6">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Staff Member
                    </Button>
                )}

                {/* Add/Edit Form */}
                {showAddForm && <StaffForm />}

                {/* Staff List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Team Members ({staffMembers?.length || 0})</h2>
                    </div>

                    {staffMembers?.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members yet</h3>
                                <p className="text-gray-500 mb-4">Get started by adding your first team member</p>
                                <Button onClick={() => setShowAddForm(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Staff Member
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {staffMembers?.map((staff) => (
                                <Card key={staff.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback className={`${staff.color} text-white`}>
                                                        {staff.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{staff.name}</h3>
                                                    <p className="text-sm text-gray-500">Team Member</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(staff)} className="h-8 w-8 p-0">
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
                                                                {staff.tasks?.length > 0 && (
                                                                    <span className="block mt-2 text-amber-600 font-medium">
                                                                        Warning: This staff member has {staff.tasks.length} assigned task(s).
                                                                    </span>
                                                                )}
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(staff.id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">Assigned Tasks</span>
                                                <Badge variant="secondary">{staff.tasks?.length || 0}</Badge>
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
                                                    <span className="text-gray-700">
                                                        {colorOptions.find((c) => c.value === staff.color)?.label || "Unknown"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}