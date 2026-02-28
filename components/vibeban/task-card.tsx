'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { wouldCreateCycle } from '@/lib/vibeban/prerequisites'
import type {
  Task,
  Prerequisite,
  TaskType,
  Priority,
  Urgency,
} from '@/lib/vibeban/types'

const supabase = createClient()

interface TaskCardProps {
  task: Task
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onDelete: (taskId: string) => void
  onCreateReview: (parentTaskId: string) => void
  /** When provided, opens task in view mode */
  onView?: (task: Task) => void
  /** When provided, pencil click opens task page/modal; when omitted, pencil toggles inline edit */
  onEdit?: (task: Task) => void
  /** Current user id for showing "Me" vs "Unassigned" for assignee */
  currentUserId?: string | null
  allTasks: Task[]
  prerequisites: Prerequisite[]
  onPrerequisitesChanged: () => void
  blockedTaskIds: string[]
}

export const TASK_TYPES = [
  {
    value: 'task',
    label: '📋 Task',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  },
  {
    value: 'review',
    label: '🔍 Review',
    color:
      'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  },
  {
    value: 'bug',
    label: '🐛 Bug',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  },
  {
    value: 'feature',
    label: '✨ Feature',
    color:
      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  },
  {
    value: 'research',
    label: '🔬 Research',
    color:
      'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
  },
]

export function TaskCard({
  task,
  onUpdate,
  onDelete,
  onCreateReview: _onCreateReview,
  onEdit,
  onView,
  currentUserId,
  allTasks,
  prerequisites,
  onPrerequisitesChanged,
  blockedTaskIds,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description)
  const [editType, setEditType] = useState<TaskType>(task.type || 'task')
  const [editPriority, setEditPriority] = useState<Priority>(
    task.priority || 'medium',
  )
  const [editUrgency, setEditUrgency] = useState<Urgency>(
    task.urgency || 'medium',
  )
  const [editDueDate, setEditDueDate] = useState(task.due_date || '')
  const [editEstimatedHours, setEditEstimatedHours] = useState(
    task.estimated_hours || 0,
  )
  const [showPrereqPicker, setShowPrereqPicker] = useState(false)
  const [prereqSearch, setPrereqSearch] = useState('')

  const handleSave = () => {
    onUpdate(task.id, {
      title: editTitle,
      description: editDescription,
      type: editType,
      priority: editPriority,
      urgency: editUrgency,
      due_date: editDueDate || null,
      estimated_hours: editEstimatedHours,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditType(task.type || 'task')
    setEditPriority(task.priority || 'medium')
    setEditUrgency(task.urgency || 'medium')
    setEditDueDate(task.due_date || '')
    setEditEstimatedHours(task.estimated_hours || 0)
    setIsEditing(false)
  }

  const toggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onUpdate(task.id, {
      status: task.status === 'complete' ? 'incomplete' : 'complete',
    })
  }

  const addPrerequisite = async (prereqTaskId: string) => {
    if (wouldCreateCycle(task.id, prereqTaskId, prerequisites)) {
      alert(
        'This would create a circular dependency (e.g. Task 1 → Task 2 and Task 2 → Task 1). Choose a different prerequisite.',
      )
      return
    }
    const { error } = await supabase
      .from('task_prerequisites')
      .insert([{ task_id: task.id, prerequisite_task_id: prereqTaskId }])

    if (error) {
      console.error('Error adding prerequisite:', error)
      if (error.message?.includes('duplicate')) {
        alert('This prerequisite already exists.')
      } else {
        alert(`Error: ${error.message}`)
      }
      return
    }
    onPrerequisitesChanged()
    setShowPrereqPicker(false)
    setPrereqSearch('')
  }

  const removePrerequisite = async (prereqId: string) => {
    const { error } = await supabase
      .from('task_prerequisites')
      .delete()
      .eq('id', prereqId)

    if (error) {
      console.error('Error removing prerequisite:', error)
      return
    }
    onPrerequisitesChanged()
  }

  const typeInfo =
    TASK_TYPES.find((t) => t.value === task.type) || TASK_TYPES[0]
  const isComplete = task.status === 'complete'
  const isOverdue =
    task.due_date && new Date(task.due_date) < new Date() && !isComplete

  // Blocked if any prerequisite is incomplete (all must complete)
  const prereqTaskIds = prerequisites.map((p) => p.prerequisite_task_id)
  const prereqTasks = allTasks.filter((t) => prereqTaskIds.includes(t.id))
  const incompletePrereqs = prereqTasks.filter((t) => t.status === 'incomplete')

  const isBlocked = prereqTasks.length > 0 && incompletePrereqs.length > 0

  // Available tasks to add as prerequisites (not self, not already a prereq, and would not create a cycle)
  const availableForPrereq = allTasks
    .filter((t) => t.id !== task.id && !prereqTaskIds.includes(t.id))
    .filter((t) => !wouldCreateCycle(task.id, t.id, prerequisites))
    .filter((t) => {
      if (!prereqSearch) return true
      return t.title.toLowerCase().includes(prereqSearch.toLowerCase())
    })

  const parentTask = task.parent_task_id
    ? allTasks.find((t) => t.id === task.parent_task_id)
    : null

  // Tasks this task is blocking
  const blockedTasks = allTasks.filter((t) => blockedTaskIds.includes(t.id))
  const isBlocker = blockedTasks.length > 0

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'border-l-red-500'
      case 'high':
        return 'border-l-orange-500'
      case 'medium':
        return 'border-l-yellow-500'
      case 'low':
        return 'border-l-green-500'
      default:
        return 'border-l-gray-300'
    }
  }

  if (isEditing) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="mb-3 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          rows={3}
          placeholder="Description..."
        />

        <div className="mb-3 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Type
            </label>
            <select
              value={editType}
              onChange={(e) => setEditType(e.target.value as TaskType)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              {TASK_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Urgency
            </label>
            <select
              value={editUrgency}
              onChange={(e) => setEditUrgency(e.target.value as Urgency)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🟠 High</option>
              <option value="critical">🔴 Critical</option>
            </select>
          </div>
        </div>

        <div className="mb-3 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Priority
            </label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Est. Hours
            </label>
            <input
              type="number"
              value={editEstimatedHours}
              onChange={(e) =>
                setEditEstimatedHours(parseInt(e.target.value) || 0)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              min={0}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Due Date
          </label>
          <input
            type="date"
            value={
              editDueDate
                ? new Date(editDueDate).toISOString().split('T')[0]
                : ''
            }
            onChange={(e) => setEditDueDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Prerequisites section in edit mode */}
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              🔗 Prerequisites ({prereqTasks.length})
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPrereqPicker(!showPrereqPicker)}
                className="rounded-md bg-blue-600 px-2 py-0.5 text-xs text-white transition-colors hover:bg-blue-700"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Current prerequisites */}
          {prereqTasks.length > 0 && (
            <div className="mb-2 space-y-1.5">
              {prerequisites.map((prereq) => {
                const prereqTask = allTasks.find(
                  (t) => t.id === prereq.prerequisite_task_id,
                )
                if (!prereqTask) return null
                return (
                  <div
                    key={prereq.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className={`h-2 w-2 flex-shrink-0 rounded-full ${prereqTask.status === 'complete' ? 'bg-green-500' : 'bg-amber-500'}`}
                    ></span>
                    <span
                      className={`flex-1 truncate ${prereqTask.status === 'complete' ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      {prereqTask.title}
                    </span>
                    <button
                      onClick={() => removePrerequisite(prereq.id)}
                      className="flex-shrink-0 text-xs text-red-400 transition-colors hover:text-red-600"
                      title="Remove prerequisite"
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {prereqTasks.length === 0 && !showPrereqPicker && (
            <p className="text-xs italic text-gray-400 dark:text-gray-500">
              No prerequisites set
            </p>
          )}

          {/* Prerequisite picker */}
          {showPrereqPicker && (
            <div className="mt-2 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
              <input
                type="text"
                value={prereqSearch}
                onChange={(e) => setPrereqSearch(e.target.value)}
                placeholder="Search tasks to add..."
                className="w-full border-b border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
              <div className="max-h-40 overflow-y-auto">
                {availableForPrereq.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">
                    No tasks available
                  </p>
                ) : (
                  availableForPrereq.slice(0, 10).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => addPrerequisite(t.id)}
                      className="flex w-full items-center gap-2 border-b border-gray-100 px-3 py-2 text-left text-sm text-gray-700 transition-colors last:border-b-0 hover:bg-blue-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-blue-900/20"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${t.status === 'complete' ? 'bg-green-500' : 'bg-amber-500'}`}
                      ></span>
                      <span className="truncate">{t.title}</span>
                      <span className="ml-auto flex-shrink-0 text-xs text-gray-400">
                        {t.type}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-gray-200 pt-2 dark:border-gray-600">
          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-1.5 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this task?')) onDelete(task.id)
            }}
            className="ml-auto rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) onEdit(task)
    else setIsEditing(true)
  }

  return (
    <div
      className={`group rounded-xl border border-l-4 border-gray-200 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 ${getUrgencyStyle(task.urgency || 'medium')} transition-all duration-200 hover:shadow-md ${isComplete ? 'opacity-60' : ''} ${isBlocked && !isComplete ? 'ring-1 ring-amber-300 dark:ring-amber-700' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Completion checkbox */}
        <button
          onClick={toggleComplete}
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            isComplete
              ? 'border-green-500 bg-green-500 text-white'
              : 'border-gray-300 hover:border-green-400 dark:border-gray-500 dark:hover:border-green-400'
          }`}
        >
          {isComplete && (
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          {/* Title row */}
          <div className="mb-1">
            <h4
              className={`truncate text-sm font-semibold text-gray-900 dark:text-white ${isComplete ? 'line-through' : ''}`}
            >
              {task.title}
            </h4>
          </div>

          {/* Assignee & Reporter */}
          <div className="mb-1 space-y-0.5 text-[11px] text-gray-500 dark:text-gray-400">
            <div>
              {task.assignee_id
                ? task.assignee_id === currentUserId
                  ? 'Assigned to: Me'
                  : 'Assigned'
                : 'Unassigned'}
            </div>
            {task.reporter_id != null && (
              <div>
                Reported by: {task.reporter_id === currentUserId ? 'Me' : '—'}
              </div>
            )}
          </div>

          {/* Blocked indicator */}
          {isBlocked && !isComplete && (
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              <span>⚠️ Blocked — needs:</span>
              <span className="text-amber-500 dark:text-amber-300">
                {incompletePrereqs.map((p) => p.title).join(', ')}
              </span>
            </div>
          )}

          {/* Blocker indicator — this task is blocking others */}
          {isBlocker && !isComplete && (
            <div className="mb-1.5 rounded-lg border border-red-200 bg-red-50 p-2 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                <span>
                  🚫 Blocking {blockedTasks.length} task
                  {blockedTasks.length > 1 ? 's' : ''}:
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {blockedTasks.map((bt) => (
                  <span
                    key={bt.id}
                    className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  >
                    {bt.title.length > 30
                      ? bt.title.substring(0, 30) + '…'
                      : bt.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Parent task link (for reviews) */}
          {parentTask && (
            <p className="mb-1.5 text-xs text-purple-600 dark:text-purple-400">
              🔗 Review of:{' '}
              <span className="font-medium">{parentTask.title}</span>
            </p>
          )}

          {/* Description */}
          {task.description && (
            <p
              className={`mb-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400 ${isComplete ? 'line-through' : ''}`}
            >
              {task.description}
            </p>
          )}

          {/* Prerequisites display (compact) */}
          {prereqTasks.length > 0 && (
            <div className="mb-2">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500">
                  Prereqs (all required)
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {prereqTasks.map((pt) => (
                  <span
                    key={pt.id}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                      pt.status === 'complete'
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${pt.status === 'complete' ? 'bg-green-500' : 'bg-amber-500'}`}
                    ></span>
                    {pt.title.length > 25
                      ? pt.title.substring(0, 25) + '…'
                      : pt.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags row (bottom): type, due date, estimated hours */}
          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-gray-100 pt-2 text-xs dark:border-gray-600">
            <span
              className={`rounded-full px-2 py-0.5 font-medium ${typeInfo.color}`}
            >
              {typeInfo.label}
            </span>
            {task.due_date && (
              <span
                className={`rounded-md px-2 py-0.5 font-medium ${
                  isOverdue
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                }`}
              >
                📅 {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
            {task.estimated_hours > 0 && (
              <span className="rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                ⏱️ {task.estimated_hours}h
              </span>
            )}
          </div>
        </div>

        {/* Actions (visible on hover): pencil = edit, trash = delete */}
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onView && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onView(task)
              }}
              title="View details"
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-500 dark:hover:bg-green-900/20"
            >
              👁️
            </button>
          )}
          <button
            onClick={handleOpenEdit}
            title="Edit task"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-900/20"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (confirm('Delete this task?')) onDelete(task.id)
            }}
            title="Delete"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
