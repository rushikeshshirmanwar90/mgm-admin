"use client"

import { AddTaskForm } from './AddTaskForm'
import { SearchBar } from './SearchBar'
import { AllTasksSection } from './AllTaskSection'
import { StaffMemberCard } from './StaffMemberCard'
import { useTaskManagement } from './useTaskMangment'
import BeautifulSpinner from '@/components/ui/BeautifulSpinner'
import { ToastContainer } from 'react-toastify'

export default function TaskAssignmentBoard() {

    const {
        allTasks,
        filteredStaffMembers,
        searchQuery,
        draggedTaskId,
        dragOverTarget,
        movingTaskId,
        targetBoardId,
        setSearchQuery,
        setDragOverTarget,
        addTask,
        deleteTask,
        duplicateTask,
        handleDrop,
        handleDragStart,
        handleDragEnd,
        removeTaskFromStaff,
        loading
    } = useTaskManagement()

    if (loading) {
        return <BeautifulSpinner />
    }

    return (
        <>

            <ToastContainer position="top-center" autoClose={1200} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Assignment Board</h1>
                        <p className="text-gray-600">Assign tasks to team members • Drag tasks between sections</p>
                    </div>

                    {/* Add Task Section */}
                    <AddTaskForm onAddTask={addTask} />

                    {/* Search Staff Members */}
                    <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

                    {/* Task Sections */}
                    <div className="flex gap-6">
                        {/* All Tasks Section */}
                        <AllTasksSection
                            tasks={allTasks}
                            draggedTaskId={draggedTaskId}
                            dragOverTarget={dragOverTarget}
                            movingTaskId={movingTaskId}
                            targetBoardId={targetBoardId}
                            onDragOver={setDragOverTarget}
                            onDragLeave={() => setDragOverTarget(null)}
                            onDrop={handleDrop}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDuplicate={duplicateTask}
                            onDelete={deleteTask}
                        />

                        {/* Staff Members Section */}
                        <div className="flex flex-wrap gap-3 flex-start">
                            {filteredStaffMembers.map((staff) => (
                                <StaffMemberCard
                                    key={staff.id}
                                    staff={staff}
                                    draggedTaskId={draggedTaskId}
                                    dragOverTarget={dragOverTarget}
                                    movingTaskId={movingTaskId}
                                    targetBoardId={targetBoardId}
                                    onDragOver={setDragOverTarget}
                                    onDragLeave={() => setDragOverTarget(null)}
                                    onDrop={handleDrop}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    onDuplicate={duplicateTask}
                                    onDelete={deleteTask}
                                    onRemoveFromStaff={removeTaskFromStaff}
                                />
                            ))}
                        </div>
                    </div>

                    {/* No results message */}
                    {searchQuery && filteredStaffMembers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">No staff members found matching `{searchQuery}`</div>
                    )}
                </div>
            </div>
        </>

    )
}