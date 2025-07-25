"use client"

import { useState } from "react"
import { Plus, Users, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import StaffForm from "@/components/StaffManagement/staff-form"
import AllImagesSection from "@/components/StaffManagement/all-images-section"
import StaffCard from "@/components/StaffManagement/staff-card"
import UploadDialog from "@/components/StaffManagement/upload-dialog"
import { useStaffManagement } from "@/hooks/useStaffManagement"
import { StaffMember } from "@/hooks/useStaffManagement"

export default function StaffManagementPage() {
  const router = useRouter()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)

  const {
    staffMembers,
    formName,
    setFormName,
    formColor,
    setFormColor,
    draggedImageId,
    isGeneratingPDF,
    showUploadDialog,
    setShowUploadDialog,
    selectedStaffForUpload,
    selectedTaskId,
    setSelectedTaskId,
    getAllImages,
    getStaffWithTasks,
    resetForm,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
    openUploadDialog,
    handleFileSelect,
    confirmUpload,
    removeImage,
    handleImageDragStart,
    handleImageDragOver,
    handleImageDrop,
    generatePDF,
  } = useStaffManagement()

  const handleEditStaff = (staff : StaffMember) => {
    setEditingStaff(staff)
    handleEdit(staff)
    setShowAddForm(true)
  }

  const handleFormSubmit = () => {
    if (editingStaff) {
      handleUpdate()
    } else {
      handleAdd()
    }
    setEditingStaff(null)
    setShowAddForm(false)
  }

  const handleFormCancel = () => {
    resetForm()
    setEditingStaff(null)
    setShowAddForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Board
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
          <p className="text-gray-600">Manage your team members • Add, edit, or remove staff • Upload task images</p>
        </div>

        {/* Add Staff Button */}
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} className="mb-6">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <StaffForm
            formName={formName}
            setFormName={setFormName}
            formColor={formColor}
            setFormColor={setFormColor}
            editingStaff={editingStaff}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}

        {/* All Images Section */}
        <AllImagesSection
          images={getAllImages()}
          isGeneratingPDF={isGeneratingPDF}
          draggedImageId={draggedImageId}
          onGeneratePDF={generatePDF}
          onRemoveImage={removeImage}
          onImageDragStart={handleImageDragStart}
          onImageDragOver={handleImageDragOver}
          onImageDrop={handleImageDrop}
        />

        {/* Staff List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Team Members ({staffMembers.length})</h2>
          </div>

          {staffMembers.length === 0 ? (
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
              {staffMembers.map((staff) => (
                <StaffCard
                  key={staff.id}
                  staff={staff}
                  onEdit={handleEditStaff}
                  onDelete={handleDelete}
                  onFileSelect={handleFileSelect}
                />
              ))}
            </div>
          )}
        </div>

        {/* Upload Dialog */}
        <UploadDialog
          isOpen={showUploadDialog}
          onClose={() => setShowUploadDialog(false)}
          selectedStaff={selectedStaffForUpload}
          selectedTaskId={selectedTaskId}
          onTaskSelect={setSelectedTaskId}
          onConfirm={confirmUpload}
        />
      </div>
    </div>
  )
}
