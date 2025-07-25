import { DragOverTarget } from './types'

interface DropZoneProps {
  type: "all" | "staff"
  id?: string
  index: number
  isActive: boolean
  onDragOver: (target: DragOverTarget) => void
  onDrop: (type: "all" | "staff", id?: string, index?: number) => void
}

export const DropZone = ({ type, id, index, isActive, onDragOver, onDrop }: DropZoneProps) => {
  return (
    <div
      className={`h-3 transition-all rounded ${isActive ? "border-2 border-dashed border-blue-400 bg-blue-50" : "border border-transparent"
        }`}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onDragOver({ type, id, index })
      }}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onDrop(type, id, index)
      }}
    />
  )
}