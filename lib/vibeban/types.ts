/*
 * ═══════════════════════════════════════════════════════════════
 *  Blyatz — Task Data Model
 * ═══════════════════════════════════════════════════════════════
 *
 *  TASK (core unit of work)
 *  ├── assignee_id         → who is responsible
 *  ├── reporter_id         → who created/reported the task
 *  ├── type                → task | review | bug | feature | research
 *  ├── description         → free-text explanation
 *  ├── prerequisite_mode   → 'all' (all prerequisites must complete)
 *  ├── prerequisites[]     → links to other tasks that must finish first
 *  └── requirements[]      → checklist of acceptance criteria
 *       ├── user_statement  → "As a user I want…"
 *       └── design_spec     → "Must conform to design X…"
 *
 * ═══════════════════════════════════════════════════════════════
 */

// ─── Task ───────────────────────────────────────────────────────
export interface Task {
    id: string;
    project_id: string;
    title: string;
    description: string;
    type: TaskType;
    status: TaskStatus;
    assignee_id: string | null;
    reporter_id: string | null;
    priority: Priority;
    urgency: Urgency;
    due_date: string | null;
    estimated_hours: number;
    parent_task_id: string | null;   // links a review task → its parent
    prerequisite_mode: PrerequisiteMode;
    created_at: string;
    updated_at?: string;
}

export type TaskType = 'task' | 'review' | 'bug' | 'feature' | 'research';
export type TaskStatus = 'incomplete' | 'complete';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Urgency = 'low' | 'medium' | 'high' | 'critical';
export type PrerequisiteMode = 'all';

// ─── Prerequisite (edge in the dependency graph) ────────────────
export interface Prerequisite {
    id: string;
    task_id: string;              // the task that is blocked
    prerequisite_task_id: string; // the task that must be done first
    created_at?: string;
}

// ─── Requirement (acceptance criteria on a task) ────────────────
export type RequirementSourceType = 'user_statement' | 'design_spec';

export interface TaskRequirement {
    id: string;
    task_id: string;
    source_type: RequirementSourceType;
    content: string;
    is_met: boolean;
    sort_order: number;
    created_at?: string;
    updated_at?: string;
}

// ─── Convenience / UI types ─────────────────────────────────────
export const TASK_TYPE_OPTIONS: { value: TaskType; label: string; emoji: string }[] = [
    { value: 'task', label: 'Task', emoji: '📋' },
    { value: 'review', label: 'Review', emoji: '🔍' },
    { value: 'bug', label: 'Bug', emoji: '🐛' },
    { value: 'feature', label: 'Feature', emoji: '✨' },
    { value: 'research', label: 'Research', emoji: '🔬' },
];

export const URGENCY_ORDER: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
};
