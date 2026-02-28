'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { wouldCreateCycle } from '@/lib/vibeban/prerequisites'
import { TaskCard, TASK_TYPES } from './task-card'
import { TopologicalGraph, computeLayers } from './topological-graph'
import type { Task, Prerequisite, TaskRequirement } from '@/lib/vibeban/types'
import { TASK_TYPE_OPTIONS } from '@/lib/vibeban/types'

const supabase = createClient()

interface TaskListProps {
  projectId: string
}

export function TaskList({ projectId }: TaskListProps) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([])
  const [requirements, setRequirements] = useState<TaskRequirement[]>([])
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentBank, setCurrentBank] = useState(0)

  // Modal state — null = closed, 'new' = create, Task = editing
  const [modalTask, setModalTask] = useState<Task | 'new' | null>(null)
  const [viewTask, setViewTask] = useState<Task | null>(null)

  // Form state (shared by create & edit)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formType, setFormType] = useState('task')
  const [formUrgency, setFormUrgency] = useState('medium')
  const [formPriority, setFormPriority] = useState('medium')
  const [formAssigneeId, setFormAssigneeId] = useState<string | null>(null)
  const [formPrereqIds, setFormPrereqIds] = useState<string[]>([])
  const [prereqSearch, setPrereqSearch] = useState('')

  useEffect(() => {
    loadTasks()
    loadPrerequisites()
    loadRequirements()
  }, [projectId])

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error loading tasks:', error)
      return
    }
    if (data) setTasks(data)
  }

  const loadPrerequisites = async () => {
    const { data: taskIds } = await supabase
      .from('tasks')
      .select('id')
      .eq('project_id', projectId)
    if (!taskIds || taskIds.length === 0) {
      setPrerequisites([])
      return
    }
    const ids = taskIds.map((t) => t.id)
    const { data, error } = await supabase
      .from('task_prerequisites')
      .select('*')
      .in('task_id', ids)
    if (error) {
      console.error('Error loading prerequisites:', error)
      return
    }
    if (data) setPrerequisites(data)
  }

  const loadRequirements = async () => {
    const { data: taskIds } = await supabase
      .from('tasks')
      .select('id')
      .eq('project_id', projectId)
    if (!taskIds || taskIds.length === 0) {
      setRequirements([])
      return
    }
    const ids = taskIds.map((t) => t.id)
    const { data, error } = await supabase
      .from('task_requirements')
      .select('*')
      .in('task_id', ids)
    if (error) {
      console.error('Error loading requirements:', error)
      return
    }
    if (data) setRequirements(data)
  }

  // Layers
  const layers = useMemo(
    () => computeLayers(tasks, prerequisites),
    [tasks, prerequisites],
  )
  useEffect(() => {
    if (layers.length > 0 && currentBank >= layers.length)
      setCurrentBank(Math.max(0, layers.length - 1))
  }, [layers.length, currentBank])
  const layer0Tasks = useMemo(
    () => layers[currentBank] || [],
    [layers, currentBank],
  )

  // Filtered tasks for graph and bank view (search + type filter)
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return t.title.toLowerCase().includes(q)
      }
      if (filterType !== 'all' && t.type !== filterType) return false
      return true
    })
  }, [tasks, searchQuery, filterType])

  // Bank view: current bank tasks that also pass search/filter
  const bankViewTaskIds = useMemo(
    () => new Set(filteredTasks.map((t) => t.id)),
    [filteredTasks],
  )
  const bankViewTasks = useMemo(
    () => layer0Tasks.filter((t) => bankViewTaskIds.has(t.id)),
    [layer0Tasks, bankViewTaskIds],
  )

  type MainView = 'bank' | 'graph'
  const [mainView, setMainView] = useState<MainView>('bank')

  // Helpers
  const getPrereqsForTask = (taskId: string) =>
    prerequisites.filter((p) => p.task_id === taskId)
  const isTaskBlocked = (taskId: string) => {
    const prereqs = getPrereqsForTask(taskId)
    if (prereqs.length === 0) return false
    const prereqTaskIds = prereqs.map((p) => p.prerequisite_task_id)
    const prereqTasks = tasks.filter((t) => prereqTaskIds.includes(t.id))
    if (prereqTasks.length === 0) return false
    const incompleteCount = prereqTasks.filter(
      (t) => t.status === 'incomplete',
    ).length
    return incompleteCount > 0
  }

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
    if (error) {
      console.error('Error updating task:', error)
      return
    }
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)))
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (error) {
      console.error('Error deleting task:', error)
      return
    }
    setTasks(tasks.filter((t) => t.id !== taskId))
    setPrerequisites(
      prerequisites.filter(
        (p) => p.task_id !== taskId && p.prerequisite_task_id !== taskId,
      ),
    )
    setModalTask(null)
  }

  const handleCreateReview = async (parentTaskId: string) => {
    const parent = tasks.find((t) => t.id === parentTaskId)
    if (!parent) return
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          project_id: projectId,
          title: `Review: ${parent.title}`,
          description: '',
          type: 'review',
          urgency: parent.urgency,
          priority: parent.priority,
          prerequisite_mode: 'all',
          parent_task_id: parentTaskId,
          reporter_id: user?.id ?? null,
        },
      ])
      .select()
      .single()
    if (error) {
      console.error('Error creating review task:', error)
      return
    }
    if (data) {
      setTasks([data, ...tasks])
      await loadPrerequisites()
    }
  }

  // ── Modal helpers ──────────────────────────────────────────
  const openCreateModal = () => {
    setFormTitle('')
    setFormDescription('')
    setFormType('task')
    setFormUrgency('medium')
    setFormPriority('medium')
    setFormAssigneeId(user?.id ?? null)
    setFormPrereqIds([])
    setPrereqSearch('')
    setModalTask('new')
  }

  const openEditModal = (task: Task) => {
    setFormTitle(task.title)
    setFormDescription(task.description || '')
    setFormType(task.type)
    setFormUrgency(task.urgency)
    setFormPriority(task.priority)
    setFormAssigneeId(task.assignee_id ?? null)
    setFormPrereqIds(
      prerequisites
        .filter((p) => p.task_id === task.id)
        .map((p) => p.prerequisite_task_id),
    )
    setPrereqSearch('')
    setModalTask(task)
  }

  const closeModal = () => setModalTask(null)

  const handleSaveModal = async () => {
    const title = formTitle.trim()
    if (!title) return

    if (modalTask === 'new') {
      // ── CREATE ──
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            project_id: projectId,
            title,
            description: formDescription,
            type: formType,
            urgency: formUrgency,
            priority: formPriority,
            assignee_id: formAssigneeId || null,
            reporter_id: user?.id ?? null,
            prerequisite_mode: 'all',
          },
        ])
        .select()
        .single()

      if (error) {
        alert(`Error: ${error.message}`)
        return
      }
      if (data) {
        const safePrereqIds = formPrereqIds.filter(
          (pid) => !wouldCreateCycle(data.id, pid, prerequisites),
        )
        const skipped = formPrereqIds.length - safePrereqIds.length
        if (skipped > 0) {
          alert(
            `${skipped} prerequisite(s) were skipped because they would create a circular dependency.`,
          )
        }
        if (safePrereqIds.length > 0) {
          await supabase
            .from('task_prerequisites')
            .insert(
              safePrereqIds.map((pid) => ({
                task_id: data.id,
                prerequisite_task_id: pid,
              })),
            )
        }
        setTasks([data, ...tasks])
        await loadPrerequisites()
      }
    } else if (modalTask) {
      // ── UPDATE ──
      const updates: Partial<Task> = {
        title,
        description: formDescription,
        type: formType as Task['type'],
        urgency: formUrgency as Task['urgency'],
        priority: formPriority as Task['priority'],
        assignee_id: formAssigneeId || null,
        prerequisite_mode: 'all',
      }
      await handleTaskUpdate(modalTask.id, updates)

      // Sync prerequisites
      const existingPrereqIds = prerequisites
        .filter((p) => p.task_id === modalTask.id)
        .map((p) => p.prerequisite_task_id)
      const toDelete = existingPrereqIds.filter(
        (id) => !formPrereqIds.includes(id),
      )
      const toAddRaw = formPrereqIds.filter(
        (id) => !existingPrereqIds.includes(id),
      )
      const toAdd = toAddRaw.filter(
        (pid) => !wouldCreateCycle(modalTask.id, pid, prerequisites),
      )
      const skipped = toAddRaw.length - toAdd.length
      if (skipped > 0) {
        alert(
          `${skipped} prerequisite(s) were skipped because they would create a circular dependency.`,
        )
      }

      if (toDelete.length > 0) {
        await supabase
          .from('task_prerequisites')
          .delete()
          .eq('task_id', modalTask.id)
          .in('prerequisite_task_id', toDelete)
      }
      if (toAdd.length > 0) {
        await supabase
          .from('task_prerequisites')
          .insert(
            toAdd.map((pid) => ({
              task_id: modalTask.id,
              prerequisite_task_id: pid,
            })),
          )
      }
      await loadPrerequisites()
    }
    closeModal()
  }

  // Header Stats
  const total = layer0Tasks.length
  const completed = layer0Tasks.filter(
    (t: Task) => t.status === 'complete',
  ).length
  const incomplete = total - completed
  const progress = total > 0 ? (completed / total) * 100 : 0
  const isLayerComplete = total > 0 && incomplete === 0
  const hasNextLayer = currentBank < layers.length - 1
  const hasPrevLayer = currentBank > 0

  // Prereq picker candidates (exclude self, already selected, and any that would create a cycle)
  const prereqCandidates = useMemo(() => {
    const editingId = modalTask && modalTask !== 'new' ? modalTask.id : null
    return tasks.filter((t) => {
      if (t.id === editingId) return false
      if (formPrereqIds.includes(t.id)) return false
      if (editingId && wouldCreateCycle(editingId, t.id, prerequisites))
        return false
      if (prereqSearch)
        return t.title.toLowerCase().includes(prereqSearch.toLowerCase())
      return true
    })
  }, [tasks, modalTask, formPrereqIds, prereqSearch, prerequisites])

  return (
    <div className="relative flex h-full min-h-0 w-full min-w-0 flex-col">
      {/* Navbar Controls */}
      <div className="flex flex-shrink-0 flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-5 py-3 dark:border-gray-700 dark:bg-gray-800">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-36 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All types</option>
          {TASK_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
            View:
          </span>
          <button
            onClick={() => setMainView('bank')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${mainView === 'bank' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'}`}
          >
            Bank
          </button>
          <button
            onClick={() => setMainView('graph')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${mainView === 'graph' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'}`}
          >
            Graph
          </button>
        </div>
        <div className="flex-1"></div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
        >
          <span className="text-sm leading-none">+</span> New Task
        </button>
      </div>

      {/* Bank Header HUD */}
      <div className="z-10 w-full flex-shrink-0 transition-all duration-300">
        <div
          className={`w-full border-b px-2 py-4 transition-all duration-300 ${
            isLayerComplete
              ? 'border-green-200 bg-green-50 shadow-sm dark:border-green-800 dark:bg-green-900/20'
              : 'border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {hasPrevLayer && (
                <button
                  onClick={() => setCurrentBank(currentBank - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  ↓
                </button>
              )}
              <div>
                <h2
                  className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${isLayerComplete ? 'text-green-800 dark:text-green-300' : 'text-gray-900 dark:text-white'}`}
                >
                  Bank {currentBank + 1}
                  {isLayerComplete && (
                    <span className="animate-bounce">✨</span>
                  )}
                </h2>
                <p className="text-[10px] text-gray-500">
                  {incomplete} remaining
                </p>
              </div>
            </div>

            <div className="mx-4 max-w-xs flex-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isLayerComplete && hasNextLayer ? (
                <button
                  onClick={() => setCurrentBank(currentBank + 1)}
                  className="flex animate-pulse items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-700"
                >
                  Next Bank ↑
                </button>
              ) : (
                <span className="text-xs font-medium text-gray-400">
                  {Math.round(progress)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
                TASK CONFIGURATION MODAL (Create + Edit)
               ════════════════════════════════════════════════════ */}
      {modalTask !== null && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-12 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-5 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {modalTask === 'new' ? '✨ New Task' : '✏️ Edit Task'}
              </h3>
              <div className="flex items-center gap-2">
                {modalTask !== 'new' && (
                  <button
                    onClick={() => handleDeleteTask(modalTask.id)}
                    className="rounded-lg px-3 py-1 text-xs text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="text-xl leading-none text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="space-y-4 p-5">
              {/* Title */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Title
                </label>
                <input
                  autoFocus
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.metaKey) handleSaveModal()
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Details, context, acceptance criteria..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
              </div>

              {/* Type + Urgency + Priority */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  >
                    {TASK_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Urgency
                  </label>
                  <select
                    value={formUrgency}
                    onChange={(e) => setFormUrgency(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="critical">🔴 Critical</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Assignee */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Assignee
                </label>
                <select
                  value={formAssigneeId ?? ''}
                  onChange={(e) => setFormAssigneeId(e.target.value || null)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">Unassigned</option>
                  {user?.id && (
                    <option value={user.id}>Me ({user.email})</option>
                  )}
                </select>
              </div>

              {/* Prerequisites (all must complete) */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Prerequisites
                </label>

                {/* Selected prereqs */}
                {formPrereqIds.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {formPrereqIds.map((pid) => {
                      const t = tasks.find((tk) => tk.id === pid)
                      return (
                        <span
                          key={pid}
                          className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {t?.title || pid.slice(0, 8)}
                          <button
                            onClick={() =>
                              setFormPrereqIds(
                                formPrereqIds.filter((id) => id !== pid),
                              )
                            }
                            className="font-bold text-blue-400 hover:text-red-500"
                          >
                            &times;
                          </button>
                        </span>
                      )
                    })}
                  </div>
                )}

                {/* Search to add */}
                <input
                  type="text"
                  value={prereqSearch}
                  onChange={(e) => setPrereqSearch(e.target.value)}
                  placeholder="Search tasks to add as prerequisite..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                />
                {prereqSearch && prereqCandidates.length > 0 && (
                  <div className="mt-1 max-h-32 overflow-y-auto rounded-lg border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-900">
                    {prereqCandidates.slice(0, 8).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setFormPrereqIds([...formPrereqIds, t.id])
                          setPrereqSearch('')
                        }}
                        className="w-full border-b border-gray-100 px-3 py-1.5 text-left text-xs text-gray-800 last:border-b-0 hover:bg-blue-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-blue-900/20"
                      >
                        <span className="mr-1 text-[10px] text-gray-400">
                          {t.type.toUpperCase()}
                        </span>{' '}
                        {t.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-5 dark:border-gray-700">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                {modalTask === 'new' ? 'Create Task' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content: Bank view (list) or Full graph */}
      {mainView === 'bank' ? (
        <div className="min-h-0 flex-1 overflow-auto bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-3xl p-4">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Bank {currentBank + 1} — {bankViewTasks.length} task
              {bankViewTasks.length !== 1 ? 's' : ''}
            </h3>
            {bankViewTasks.length === 0 ? (
              <div className="py-12 text-center text-gray-400 dark:text-gray-500">
                <p className="text-sm">
                  No tasks in this bank matching filters.
                </p>
                <p className="mt-1 text-xs">
                  Add tasks or adjust search/type filter.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {bankViewTasks.map((task) => (
                  <li key={task.id}>
                    <TaskCard
                      task={task}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleDeleteTask}
                      onCreateReview={handleCreateReview}
                      onEdit={openEditModal}
                      onView={(t) => setViewTask(t)}
                      currentUserId={user?.id ?? null}
                      allTasks={tasks}
                      prerequisites={getPrereqsForTask(task.id)}
                      onPrerequisitesChanged={loadPrerequisites}
                      blockedTaskIds={prerequisites
                        .filter((p) => p.prerequisite_task_id === task.id)
                        .map((p) => p.task_id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <TopologicalGraph
          tasks={filteredTasks}
          prerequisites={prerequisites}
          isTaskBlocked={isTaskBlocked}
          onUpdate={handleTaskUpdate}
          onTaskClick={openEditModal}
          currentBank={currentBank}
        />
      )}

      {/* ════════════════════════════════════════════════════
                READ-ONLY TASK VIEW MODAL
               ════════════════════════════════════════════════════ */}
      {viewTask && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-12 backdrop-blur-sm"
          onClick={() => setViewTask(null)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {
                    TASK_TYPE_OPTIONS.find((o) => o.value === viewTask.type)
                      ?.emoji
                  }
                </span>
                <div>
                  <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                    {viewTask.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {viewTask.type} • {viewTask.status}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewTask(null)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto p-8">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Assignee
                  </p>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {viewTask.assignee_id
                      ? viewTask.assignee_id === user?.id
                        ? 'Me'
                        : 'Assigned'
                      : 'Unassigned'}
                  </span>
                </div>
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Reporter
                  </p>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {viewTask.reporter_id
                      ? viewTask.reporter_id === user?.id
                        ? 'Me'
                        : '—'
                      : '—'}
                  </span>
                </div>
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Urgency
                  </p>
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${
                      viewTask.urgency === 'critical'
                        ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300'
                        : viewTask.urgency === 'high'
                          ? 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                          : viewTask.urgency === 'medium'
                            ? 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                            : 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300'
                    }`}
                  >
                    {viewTask.urgency.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Priority
                  </p>
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {viewTask.priority}
                  </span>
                </div>
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Est. Time
                  </p>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {viewTask.estimated_hours}h
                  </span>
                </div>
                <div>
                  <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Due Date
                  </p>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {viewTask.due_date
                      ? new Date(viewTask.due_date).toLocaleDateString()
                      : 'No date'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <section>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Description
                </p>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap rounded-xl border border-gray-100 bg-gray-50 p-4 text-base leading-relaxed text-gray-700 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300">
                    {viewTask.description || (
                      <span className="italic text-gray-400">
                        No description provided.
                      </span>
                    )}
                  </p>
                </div>
              </section>

              {/* Requirements */}
              <section>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Acceptance Criteria
                </p>
                <div className="space-y-3">
                  {requirements.filter((r) => r.task_id === viewTask.id)
                    .length > 0 ? (
                    requirements
                      .filter((r) => r.task_id === viewTask.id)
                      .map((r) => (
                        <div
                          key={r.id}
                          className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
                        >
                          <div
                            className={`mt-1 h-4 w-4 flex-shrink-0 rounded border transition-colors ${r.is_met ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600'}`}
                          >
                            {r.is_met && (
                              <svg
                                className="mx-auto h-3 w-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={4}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={`text-sm ${r.is_met ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}
                            >
                              {r.content}
                            </p>
                            <span className="mt-1 inline-block text-[10px] font-bold uppercase text-gray-400">
                              {r.source_type === 'user_statement'
                                ? 'Voice of User'
                                : 'Technical Spec'}
                            </span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm italic text-gray-400">
                      No requirements listed.
                    </p>
                  )}
                </div>
              </section>

              {/* Prerequisites */}
              <section>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Prerequisites
                </p>
                <div className="space-y-2">
                  {getPrereqsForTask(viewTask.id).length > 0 ? (
                    getPrereqsForTask(viewTask.id).map((p) => {
                      const pt = tasks.find(
                        (t) => t.id === p.prerequisite_task_id,
                      )
                      return (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                        >
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${pt?.status === 'complete' ? 'bg-green-500' : 'bg-amber-500'}`}
                          />
                          <span
                            className={`text-sm font-medium ${pt?.status === 'complete' ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'}`}
                          >
                            {pt?.title || 'Unknown Task'}
                          </span>
                          <span className="ml-auto rounded bg-gray-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:bg-gray-900">
                            {pt?.type}
                          </span>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm italic text-gray-400">
                      No prerequisites defined.
                    </p>
                  )}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
              <button
                onClick={() => {
                  setViewTask(null)
                  openEditModal(viewTask)
                }}
                className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-bold text-blue-600 transition-all hover:bg-blue-50 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                ✏️ Edit Task
              </button>
              <button
                onClick={() => setViewTask(null)}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
