"use client"

import type React from "react"

import { ImageIcon, FileText, X, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface AllImagesSectionProps {
  images: StaffImage[]
  isGeneratingPDF: boolean
  draggedImageId: string | null
  onGeneratePDF: () => void
  onRemoveImage: (imageId: string) => void
  onImageDragStart: (e: React.DragEvent, imageId: string) => void
  onImageDragOver: (e: React.DragEvent) => void
  onImageDrop: (e: React.DragEvent, targetImageId: string) => void
}

export default function AllImagesSection({
  images,
  isGeneratingPDF,
  draggedImageId,
  onGeneratePDF,
  onRemoveImage,
  onImageDragStart,
  onImageDragOver,
  onImageDrop,
}: AllImagesSectionProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            All Task Images
            <Badge variant="secondary" className="text-xs">
              {images.length}
            </Badge>
          </span>
          {images.length > 0 && (
            <Button onClick={onGeneratePDF} disabled={isGeneratingPDF} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {isGeneratingPDF ? "Generating PDF..." : "Generate PDF"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p>No task images uploaded yet. Assign tasks to staff members and upload images below.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image, index) => (
              <Card
                key={image.id}
                className={`relative group cursor-move transition-all ${
                  draggedImageId === image.id ? "opacity-50 scale-105" : ""
                }`}
                draggable
                onDragStart={(e) => onImageDragStart(e, image.id)}
                onDragOver={onImageDragOver}
                onDrop={(e) => onImageDrop(e, image.id)}
              >
                <CardContent className="p-2">
                  <div className="relative">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="w-full h-24 object-cover rounded"
                    />

                    {/* Order badge */}
                    <Badge variant="secondary" className="absolute top-1 left-1 text-xs">
                      {index + 1}
                    </Badge>

                    {/* Staff badge */}
                    <Badge variant="outline" className="absolute bottom-1 left-1 text-xs bg-white/90 backdrop-blur-sm">
                      {image.staffName}
                    </Badge>

                    {/* Task badge */}
                    <Badge
                      variant="outline"
                      className="absolute bottom-1 right-1 text-xs bg-blue-50/90 text-blue-700 border-blue-200 backdrop-blur-sm"
                    >
                      {image.taskTitle.length > 10 ? `${image.taskTitle.substring(0, 10)}...` : image.taskTitle}
                    </Badge>

                    {/* Drag handle */}
                    <div className="absolute top-1 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white rounded p-1 shadow">
                        <GripVertical className="h-3 w-3 text-gray-500" />
                      </div>
                    </div>

                    {/* Remove button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => onRemoveImage(image.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <p className="text-xs text-gray-600 mt-1 truncate" title={image.name}>
                    {image.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
