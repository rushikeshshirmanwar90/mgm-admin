"use client"

import type React from "react"

import { useState, useCallback } from "react"
import jsPDF from "jspdf"

interface Task {
  id: string
  title: string
  priority: "low" | "medium" | "high"
}

interface StaffImage {
  id: string
  file: File
  url: string
  name: string
  order: number
  staffId: string
  staffName: string
  taskId: string
  taskTitle: string
}

export interface StaffMember {
  id: string
  name: string
  color: string
  tasks: Task[]
  images: StaffImage[]
}

const initialStaffMembers: StaffMember[] = [
  {
    id: "john",
    name: "John Smith",
    color: "bg-blue-500",
    tasks: [],
    images: [],
  },
  {
    id: "sarah",
    name: "Sarah Johnson",
    color: "bg-green-500",
    tasks: [],
    images: [],
  },
  {
    id: "mike",
    name: "Mike Chen",
    color: "bg-purple-500",
    tasks: [],
    images: [],
  },
  {
    id: "emma",
    name: "Emma Davis",
    color: "bg-orange-500",
    tasks: [],
    images: [],
  },
  {
    id: "alex",
    name: "Alex Wilson",
    color: "bg-pink-500",
    tasks: [],
    images: [],
  },
]

export function useStaffManagement() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaffMembers)
  const [formName, setFormName] = useState("")
  const [formColor, setFormColor] = useState("bg-blue-500")
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [selectedStaffForUpload, setSelectedStaffForUpload] = useState<StaffMember | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")
  const [pendingFiles, setPendingFiles] = useState<FileList | null>(null)

  // Get all images from all staff members
  const getAllImages = useCallback(() => {
    const images: StaffImage[] = []
    staffMembers.forEach((staff) => {
      images.push(...staff.images)
    })
    return images.sort((a, b) => a.order - b.order)
  }, [staffMembers])

  // Get staff members who have assigned tasks
  const getStaffWithTasks = useCallback(() => {
    return staffMembers.filter((staff) => staff.tasks.length > 0)
  }, [staffMembers])

  const resetForm = useCallback(() => {
    setFormName("")
    setFormColor("bg-blue-500")
    setTimeout(() => {
      const input = document.getElementById("staffName") as HTMLInputElement
      if (input) {
        input.value = ""
        input.focus()
      }
    }, 0)
  }, [])

  const handleAdd = useCallback(() => {
    if (!formName.trim()) return

    const newStaff: StaffMember = {
      id: Date.now().toString(),
      name: formName,
      color: formColor,
      tasks: [],
      images: [],
    }

    setStaffMembers((prev) => [...prev, newStaff])
    resetForm()
  }, [formName, formColor, resetForm])

  const handleEdit = useCallback((staff: StaffMember) => {
    setFormName(staff.name)
    setFormColor(staff.color)
    setTimeout(() => {
      const input = document.getElementById("staffName") as HTMLInputElement
      if (input) {
        input.focus()
        input.select()
      }
    }, 100)
  }, [])

  const handleUpdate = useCallback(() => {
    if (!formName.trim()) return

    setStaffMembers((prev) =>
      prev.map((staff) => {
        // Find the staff being edited by comparing current form values
        const isBeingEdited = staff.name === formName && staff.color === formColor
        if (isBeingEdited) {
          return { ...staff, name: formName, color: formColor }
        }
        return staff
      }),
    )
    resetForm()
  }, [formName, formColor, resetForm])

  const handleDelete = useCallback((staffId: string) => {
    setStaffMembers((prev) => prev.filter((staff) => staff.id !== staffId))
  }, [])

  const openUploadDialog = useCallback((staff: StaffMember) => {
    setSelectedStaffForUpload(staff)
    setSelectedTaskId(staff.tasks.length === 1 ? staff.tasks[0].id : "")
    setShowUploadDialog(true)
  }, [])

  const handleFileSelect = useCallback(
    (files: FileList | null, staffId: string) => {
      if (!files) return

      const staff = staffMembers.find((s) => s.id === staffId)
      if (!staff || staff.tasks.length === 0) return

      if (staff.tasks.length === 1) {
        // If staff has only one task, upload directly
        handleFileUpload(files, staffId, staff.tasks[0].id)
      } else {
        // If staff has multiple tasks, show dialog to select task
        setPendingFiles(files)
        openUploadDialog(staff)
      }
    },
    [staffMembers, openUploadDialog],
  )

  const handleFileUpload = useCallback(
    (files: FileList | null, staffId: string, taskId: string) => {
      if (!files) return

      const staff = staffMembers.find((s) => s.id === staffId)
      const task = staff?.tasks.find((t) => t.id === taskId)
      if (!staff || !task) return

      const newImages: StaffImage[] = []
      const maxOrder = getAllImages().length > 0 ? Math.max(...getAllImages().map((img) => img.order)) : -1

      Array.from(files).forEach((file, index) => {
        if (file.type.startsWith("image/")) {
          const imageId = Date.now().toString() + index
          const url = URL.createObjectURL(file)

          newImages.push({
            id: imageId,
            file,
            url,
            name: file.name,
            order: maxOrder + index + 1,
            staffId: staff.id,
            staffName: staff.name,
            taskId: task.id,
            taskTitle: task.title,
          })
        }
      })

      setStaffMembers((prev) => prev.map((s) => (s.id === staffId ? { ...s, images: [...s.images, ...newImages] } : s)))
    },
    [staffMembers, getAllImages],
  )

  const confirmUpload = useCallback(() => {
    if (pendingFiles && selectedStaffForUpload && selectedTaskId) {
      handleFileUpload(pendingFiles, selectedStaffForUpload.id, selectedTaskId)
    }
    setShowUploadDialog(false)
    setSelectedStaffForUpload(null)
    setSelectedTaskId("")
    setPendingFiles(null)
  }, [pendingFiles, selectedStaffForUpload, selectedTaskId, handleFileUpload])

  const removeImage = useCallback(
    (imageId: string) => {
      setStaffMembers((prev) =>
        prev.map((staff) => ({
          ...staff,
          images: staff.images.filter((img) => img.id !== imageId),
        })),
      )

      // Reorder all remaining images
      const allRemainingImages = getAllImages().filter((img) => img.id !== imageId)
      const reorderedImages = allRemainingImages.map((img, index) => ({ ...img, order: index }))

      // Update staff with reordered images
      setStaffMembers((prev) =>
        prev.map((staff) => ({
          ...staff,
          images: reorderedImages.filter((img) => img.staffId === staff.id),
        })),
      )
    },
    [getAllImages],
  )

  const handleImageDragStart = useCallback((e: React.DragEvent, imageId: string) => {
    setDraggedImageId(imageId)
    e.dataTransfer.effectAllowed = "move"
  }, [])

  const handleImageDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  const handleImageDrop = useCallback(
    (e: React.DragEvent, targetImageId: string) => {
      e.preventDefault()

      if (!draggedImageId || draggedImageId === targetImageId) {
        setDraggedImageId(null)
        return
      }

      const allCurrentImages = getAllImages()
      const draggedIndex = allCurrentImages.findIndex((img) => img.id === draggedImageId)
      const targetIndex = allCurrentImages.findIndex((img) => img.id === targetImageId)

      if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedImageId(null)
        return
      }

      const newImages = [...allCurrentImages]
      const [draggedImage] = newImages.splice(draggedIndex, 1)
      newImages.splice(targetIndex, 0, draggedImage)

      // Reorder all images
      const reorderedImages = newImages.map((img, index) => ({ ...img, order: index }))

      // Update staff with reordered images
      setStaffMembers((prev) =>
        prev.map((staff) => ({
          ...staff,
          images: reorderedImages.filter((img) => img.staffId === staff.id),
        })),
      )

      setDraggedImageId(null)
    },
    [draggedImageId, getAllImages],
  )

  const generatePDF = useCallback(async () => {
    const allCurrentImages = getAllImages()
    if (allCurrentImages.length === 0) return

    setIsGeneratingPDF(true)

    try {
      const pdf = new jsPDF()

      for (let i = 0; i < allCurrentImages.length; i++) {
        const image = allCurrentImages[i]

        // Add new page for each image except the first one
        if (i > 0) {
          pdf.addPage()
        }

        // Load image
        const img = new Image()
        img.crossOrigin = "anonymous"

        await new Promise((resolve, reject) => {
          img.onload = () => {
            try {
              // Calculate dimensions to fit the page
              const pageWidth = pdf.internal.pageSize.getWidth()
              const pageHeight = pdf.internal.pageSize.getHeight()
              const margin = 20
              const availableWidth = pageWidth - margin * 2
              const availableHeight = pageHeight - margin * 5 // Extra margin for headers and page number

              let imgWidth = img.width
              let imgHeight = img.height

              // Scale image to fit within available space
              const widthRatio = availableWidth / imgWidth
              const heightRatio = availableHeight / imgHeight
              const ratio = Math.min(widthRatio, heightRatio)

              imgWidth *= ratio
              imgHeight *= ratio

              // Center the image
              const x = (pageWidth - imgWidth) / 2
              const y = margin + 30 // Leave space for staff name and task

              // Add staff name at top
              pdf.setFontSize(14)
              pdf.setTextColor(0, 0, 0)
              pdf.text(`Staff: ${image.staffName}`, pageWidth / 2, 15, { align: "center" })

              // Add task title
              pdf.setFontSize(12)
              pdf.setTextColor(64, 64, 64)
              pdf.text(`Task: ${image.taskTitle}`, pageWidth / 2, margin, { align: "center" })

              // Add image name
              pdf.setFontSize(10)
              pdf.setTextColor(96, 96, 96)
              pdf.text(`Image: ${image.name}`, pageWidth / 2, margin + 10, { align: "center" })

              // Add image to PDF
              pdf.addImage(img, "JPEG", x, y, imgWidth, imgHeight)

              // Add page number at bottom
              pdf.setFontSize(10)
              pdf.setTextColor(128, 128, 128)
              pdf.text(`Page ${i + 1} of ${allCurrentImages.length}`, pageWidth / 2, pageHeight - 10, {
                align: "center",
              })

              resolve(true)
            } catch (error) {
              reject(error)
            }
          }
          img.onerror = reject
          img.src = image.url
        })
      }

      // Save the PDF
      pdf.save(`all_staff_task_images_${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }, [getAllImages])

  return {
    staffMembers,
    setStaffMembers,
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
    handleFileUpload,
    confirmUpload,
    removeImage,
    handleImageDragStart,
    handleImageDragOver,
    handleImageDrop,
    generatePDF,
  }
}
