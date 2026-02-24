import type { Prerequisite } from '@/lib/vibeban/types';

/**
 * Returns true if adding (taskId -> prerequisiteTaskId) would create a cycle.
 * Edge (task_id, prerequisite_task_id) means task_id depends on prerequisite_task_id.
 * Adding (A, B) creates cycle if B already depends on A (directly or transitively).
 */
export function wouldCreateCycle(
  taskId: string,
  prerequisiteTaskId: string,
  prerequisites: Prerequisite[]
): boolean {
  if (taskId === prerequisiteTaskId) return true;

  // Graph: task_id -> [prerequisite_task_ids] (who this task depends on)
  const graph = new Map<string, string[]>();
  for (const p of prerequisites) {
    const list = graph.get(p.task_id) ?? [];
    list.push(p.prerequisite_task_id);
    graph.set(p.task_id, list);
  }

  // BFS from prerequisiteTaskId: can we reach taskId?
  // If yes, then prerequisiteTaskId depends on ... taskId, so adding taskId -> prerequisiteTaskId would create a cycle.
  const visited = new Set<string>();
  const queue = [prerequisiteTaskId];
  while (queue.length > 0) {
    const node = queue.shift()!;
    if (node === taskId) return true;
    if (visited.has(node)) continue;
    visited.add(node);
    const next = graph.get(node) ?? [];
    queue.push(...next);
  }
  return false;
}

/**
 * Filter candidate prerequisite task IDs to exclude any that would create a cycle.
 */
export function filterCycleSafePrerequisites(
  taskId: string,
  candidateIds: string[],
  prerequisites: Prerequisite[]
): string[] {
  return candidateIds.filter(
    (id) => !wouldCreateCycle(taskId, id, prerequisites)
  );
}
