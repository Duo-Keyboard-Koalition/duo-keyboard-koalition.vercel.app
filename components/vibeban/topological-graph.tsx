'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import type { Task, Prerequisite } from '@/lib/vibeban/types';

interface TopologicalGraphProps {
    tasks: Task[];
    prerequisites: Prerequisite[];
    isTaskBlocked: (taskId: string) => boolean;
    onUpdate: (taskId: string, updates: Partial<Task>) => void;
    onTaskClick?: (task: Task) => void;
    currentBank?: number;
}

interface NodePosition {
    x: number;
    y: number;
    width: number;
    height: number;
}

// Compute topological layers via BFS (Kahn's algorithm)
export function computeLayers(tasks: Task[], prerequisites: Prerequisite[]): Task[][] {
    const taskMap = new Map(tasks.map(t => [t.id, t]));
    const taskIds = tasks.map(t => t.id);
    const taskIdSet = new Set(taskIds);

    const inDegree = new Map<string, number>();
    const dependents = new Map<string, string[]>();

    for (const id of taskIds) {
        inDegree.set(id, 0);
        dependents.set(id, []);
    }

    for (const p of prerequisites) {
        if (!taskIdSet.has(p.task_id) || !taskIdSet.has(p.prerequisite_task_id)) continue;
        inDegree.set(p.task_id, (inDegree.get(p.task_id) || 0) + 1);
        dependents.get(p.prerequisite_task_id)?.push(p.task_id);
    }

    const layers: Task[][] = [];
    const placed = new Set<string>();

    let currentLayer = tasks.filter(t => (inDegree.get(t.id) || 0) === 0);

    while (currentLayer.length > 0) {
        layers.push(currentLayer);
        currentLayer.forEach(t => placed.add(t.id));

        const nextLayerIds = new Set<string>();
        for (const t of currentLayer) {
            for (const depId of (dependents.get(t.id) || [])) {
                if (placed.has(depId)) continue;
                const newDeg = (inDegree.get(depId) || 1) - 1;
                inDegree.set(depId, newDeg);
                if (newDeg <= 0) {
                    nextLayerIds.add(depId);
                }
            }
        }

        currentLayer = Array.from(nextLayerIds)
            .map(id => taskMap.get(id))
            .filter((t): t is Task => t !== undefined);
    }

    const remaining = tasks.filter(t => !placed.has(t.id));
    if (remaining.length > 0) {
        layers.push(remaining);
    }

    return layers;
}

// Vertical Layout Constants
const NODE_HEIGHT = 80;
const LAYER_GAP_Y = 150; // Vertical space between layers (includes room for label)
const NODE_GAP_X = 12;   // Horizontal gap between nodes in same layer
const PADDING_X = 0;     // No horizontal padding
const PADDING_Y = 20;    // Vertical padding

export function TopologicalGraph({ tasks, prerequisites, isTaskBlocked, onUpdate, onTaskClick, currentBank }: TopologicalGraphProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const updateSize = () => {
            setContainerSize({
                width: el.clientWidth,
                height: el.clientHeight
            });
        };

        // ResizeObserver fires when the container gets/loses size — fixes full width on load
        const ro = new ResizeObserver(updateSize);
        ro.observe(el);
        updateSize(); // immediate measure

        window.addEventListener('resize', updateSize);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', updateSize);
        };
    }, []);

    useEffect(() => {
        const check = () => setIsDark(document.documentElement.classList.contains('dark'));
        check();
        const observer = new MutationObserver(check);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // 1. Compute Layers
    const layers = useMemo(() => computeLayers(tasks, prerequisites), [tasks, prerequisites]);

    // 2. Calculate Layout (Bottom-Up, Full-Width)
    // Nodes stretch to fill the entire container width.
    const { nodePositions, svgWidth, svgHeight, layerYPositions } = useMemo(() => {
        const positions = new Map<string, NodePosition>();
        const layerYs: number[] = [];

        // Use actual container size; avoid layout with zero size
        const computedWidth = Math.max(containerSize.width, 1);
        const usableWidth = computedWidth - PADDING_X * 2;

        const totalContentHeight = layers.length * (NODE_HEIGHT + LAYER_GAP_Y) + PADDING_Y * 2;
        const computedHeight = Math.max(containerSize.height, totalContentHeight);

        // Assign positions — nodes fill the full width
        layers.forEach((layer, layerIndex) => {
            const y = computedHeight - PADDING_Y - NODE_HEIGHT - (layerIndex * (NODE_HEIGHT + LAYER_GAP_Y));
            layerYs[layerIndex] = y;

            const count = layer.length;
            // Each node gets an equal share of usable width
            const totalGaps = (count - 1) * NODE_GAP_X;
            const nodeWidth = Math.max(180, (usableWidth - totalGaps) / count);
            const layerContentWidth = count * nodeWidth + totalGaps;
            const startX = PADDING_X + (usableWidth - layerContentWidth) / 2;

            layer.forEach((task, nodeIndex) => {
                const x = startX + nodeIndex * (nodeWidth + NODE_GAP_X);
                positions.set(task.id, { x, y, width: nodeWidth, height: NODE_HEIGHT });
            });
        });

        return {
            nodePositions: positions,
            svgWidth: computedWidth,
            svgHeight: computedHeight,
            layerYPositions: layerYs
        };
    }, [layers, containerSize]);

    // 3. Auto-scroll to current bank
    useEffect(() => {
        if (containerRef.current && currentBank !== undefined && layerYPositions[currentBank] !== undefined) {
            const y = layerYPositions[currentBank];
            // Center in viewport
            const viewportHeight = containerRef.current.clientHeight;
            const scrollTop = y - viewportHeight / 2 + NODE_HEIGHT / 2;

            containerRef.current.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
            });
        }
    }, [currentBank, layerYPositions]);

    if (tasks.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
                <div className="text-center">
                    <div className="text-4xl mb-3">🔗</div>
                    <p className="text-lg font-medium">No tasks yet</p>
                    <p className="text-sm mt-1">Create tasks to see the vertical graph</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="flex-1 w-full min-w-0 min-h-0 bg-white dark:bg-gray-900 overflow-auto relative scroll-smooth py-4"
        >
            <svg
                width={svgWidth}
                height={svgHeight}
                className="block"
                style={{ minWidth: '100%', minHeight: '100%' }}
            >
                <defs>
                    <marker
                        id="arrowHead"
                        markerWidth="8"
                        markerHeight="6"
                        refX="8"
                        refY="3"
                        orient="auto"
                    >
                        <polygon
                            points="0 0, 8 3, 0 6"
                            fill={isDark ? '#4b5563' : '#9ca3af'}
                        />
                    </marker>
                </defs>

                {/* Current Bank Highlight (Horizontal Bar) */}
                {currentBank !== undefined && layerYPositions[currentBank] !== undefined && (
                    <rect
                        x={0}
                        y={layerYPositions[currentBank] - LAYER_GAP_Y / 4}
                        width={svgWidth}
                        height={NODE_HEIGHT + LAYER_GAP_Y / 2}
                        fill="currentColor"
                        className="text-green-100/50 dark:text-green-900/10"
                    />
                )}

                {/* Layer Labels — positioned above each row of nodes */}
                {layerYPositions.map((y, i) => (
                    <text
                        key={`label-${i}`}
                        x={PADDING_X}
                        y={y - 12}
                        dominantBaseline="auto"
                        className={`text-xs font-bold uppercase tracking-widest ${currentBank === i ? 'fill-green-600 dark:fill-green-400' : 'fill-gray-300 dark:fill-gray-600'
                            }`}
                        style={{ pointerEvents: 'none' }}
                    >
                        {currentBank === i ? '✨ ' : ''} Bank {i + 1}
                    </text>
                ))}

                {/* Edges (drawn first so nodes can cover them) */}
                <g aria-hidden="true">
                    {prerequisites.map(p => {
                        const fromPos = nodePositions.get(p.prerequisite_task_id);
                        const toPos = nodePositions.get(p.task_id);
                        if (!fromPos || !toPos) return null;

                        const x1 = fromPos.x + fromPos.width / 2;
                        const y1 = fromPos.y;
                        const x2 = toPos.x + toPos.width / 2;
                        const y2 = toPos.y + toPos.height;

                        const dy = Math.abs(y2 - y1) * 0.5;
                        const controlY1 = y1 - dy;
                        const controlY2 = y2 + dy;
                        const path = `M ${x1} ${y1} C ${x1} ${controlY1}, ${x2} ${controlY2}, ${x2} ${y2}`;

                        const isPrereqDone = tasks.find(t => t.id === p.prerequisite_task_id)?.status === 'complete';

                        return (
                            <path
                                key={`${p.task_id}-${p.prerequisite_task_id}`}
                                d={path}
                                stroke={isPrereqDone ? (isDark ? '#10b981' : '#22c55e') : (isDark ? '#cbd5e1' : '#e5e7eb')}
                                strokeWidth={isPrereqDone ? 2 : 1.5}
                                fill="none"
                                markerEnd="url(#arrowHead)"
                                className="transition-colors duration-300"
                                strokeDasharray={isPrereqDone ? 'none' : '4 4'}
                            />
                        );
                    })}
                </g>

                {/* Nodes (drawn after edges so they cover the lines) */}
                {tasks.map(task => {
                    const pos = nodePositions.get(task.id);
                    if (!pos) return null;

                    const isBlocked = isTaskBlocked(task.id);
                    const isDone = task.status === 'complete';
                    const nodeFill = isDone
                        ? (isDark ? 'rgb(20 83 45 / 0.3)' : 'rgb(240 253 244)')
                        : isBlocked
                            ? (isDark ? 'rgb(127 29 29 / 0.2)' : 'rgb(254 226 226)')
                            : (isDark ? 'rgb(31 41 55)' : 'rgb(255 255 255)');

                    return (
                        <g key={task.id}>
                            {/* Opaque rect so the node fully covers any line underneath */}
                            <rect
                                x={pos.x}
                                y={pos.y}
                                width={pos.width}
                                height={pos.height}
                                rx={12}
                                ry={12}
                                fill={nodeFill}
                                stroke={isDone ? (isDark ? '#166534' : '#86efac') : isBlocked ? (isDark ? '#991b1b' : '#fca5a5') : (isDark ? '#374151' : '#e5e7eb')}
                                strokeWidth={1.5}
                                style={{ paintOrder: 'stroke fill' }}
                            />
                            <foreignObject
                                x={pos.x}
                                y={pos.y}
                                width={pos.width}
                                height={pos.height}
                                className="overflow-visible"
                                style={{ pointerEvents: 'none' }}
                            >
                                <div
                                    className={`w-full h-full rounded-xl border flex items-center gap-3 px-3 shadow-sm ${isDone
                                        ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20'
                                        : isBlocked
                                            ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10'
                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                                        }`}
                                >
                                {/* Status indicator (non-interactive) */}
                                <span
                                    className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center ${isDone
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : isBlocked
                                            ? 'border-red-300 dark:border-red-700'
                                            : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                >
                                    {isDone && <span className="text-[10px] leading-none">✓</span>}
                                    {isBlocked && !isDone && <span className="text-[8px]">🔒</span>}
                                </span>
                                <div className="flex-1 min-w-0 py-2">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{task.type}</span>
                                    </div>
                                    <div className={`font-semibold text-sm leading-tight truncate ${isDone ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                                        {task.title}
                                    </div>
                                </div>
                            </div>
                        </foreignObject>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
