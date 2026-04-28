import type {
  ProjectStatus,
  TaskPriority,
  TaskStatus,
} from "@/lib/models/types";

/**
 * Tailwind classes for SelectItem rows — left accent + soft fill matching semantics.
 */
export const TASK_STATUS_SELECT_ITEM: Record<TaskStatus, string> = {
  todo:
    "border-l-[3px] border-l-slate-400 bg-slate-50/95 text-slate-900 focus:bg-slate-100 dark:border-l-slate-500 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:bg-slate-800",
  in_progress:
    "border-l-[3px] border-l-sky-500 bg-sky-50/95 text-sky-950 focus:bg-sky-100 dark:border-l-sky-400 dark:bg-sky-950/50 dark:text-sky-50 dark:focus:bg-sky-950/80",
  done:
    "border-l-[3px] border-l-emerald-500 bg-emerald-50/95 text-emerald-950 focus:bg-emerald-100 dark:border-l-emerald-400 dark:bg-emerald-950/45 dark:text-emerald-50 dark:focus:bg-emerald-950/75",
  cancelled:
    "border-l-[3px] border-l-rose-500 bg-rose-50/95 text-rose-950 focus:bg-rose-100 dark:border-l-rose-400 dark:bg-rose-950/45 dark:text-rose-50 dark:focus:bg-rose-950/75",
};

export const TASK_PRIORITY_SELECT_ITEM: Record<TaskPriority, string> = {
  low:
    "border-l-[3px] border-l-slate-400 bg-slate-50/95 text-slate-900 focus:bg-slate-100 dark:border-l-slate-500 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:bg-slate-800",
  medium:
    "border-l-[3px] border-l-amber-500 bg-amber-50/95 text-amber-950 focus:bg-amber-100 dark:border-l-amber-400 dark:bg-amber-950/45 dark:text-amber-50 dark:focus:bg-amber-950/75",
  high:
    "border-l-[3px] border-l-orange-500 bg-orange-50/95 text-orange-950 focus:bg-orange-100 dark:border-l-orange-400 dark:bg-orange-950/45 dark:text-orange-50 dark:focus:bg-orange-950/75",
  urgent:
    "border-l-[3px] border-l-red-600 bg-red-50/95 text-red-950 focus:bg-red-100 dark:border-l-red-400 dark:bg-red-950/45 dark:text-red-50 dark:focus:bg-red-950/75",
};

export const PROJECT_STATUS_SELECT_ITEM: Record<ProjectStatus, string> = {
  planning:
    "border-l-[3px] border-l-violet-500 bg-violet-50/95 text-violet-950 focus:bg-violet-100 dark:border-l-violet-400 dark:bg-violet-950/45 dark:text-violet-50 dark:focus:bg-violet-950/75",
  active:
    "border-l-[3px] border-l-emerald-500 bg-emerald-50/95 text-emerald-950 focus:bg-emerald-100 dark:border-l-emerald-400 dark:bg-emerald-950/45 dark:text-emerald-50 dark:focus:bg-emerald-950/75",
  archived:
    "border-l-[3px] border-l-stone-400 bg-stone-100/95 text-stone-900 focus:bg-stone-200 dark:border-l-stone-500 dark:bg-stone-900/60 dark:text-stone-100 dark:focus:bg-stone-800",
};

/** Closed SelectTrigger tint so the current choice reads at a glance. */
export const TASK_STATUS_SELECT_TRIGGER: Record<TaskStatus, string> = {
  todo:
    "border-slate-400/80 bg-slate-50/80 dark:border-slate-600 dark:bg-slate-900/40",
  in_progress:
    "border-sky-400/90 bg-sky-50/90 dark:border-sky-500 dark:bg-sky-950/35",
  done:
    "border-emerald-400/90 bg-emerald-50/90 dark:border-emerald-500 dark:bg-emerald-950/35",
  cancelled:
    "border-rose-400/90 bg-rose-50/90 dark:border-rose-500 dark:bg-rose-950/35",
};

export const TASK_PRIORITY_SELECT_TRIGGER: Record<TaskPriority, string> = {
  low:
    "border-slate-400/80 bg-slate-50/80 dark:border-slate-600 dark:bg-slate-900/40",
  medium:
    "border-amber-400/90 bg-amber-50/90 dark:border-amber-500 dark:bg-amber-950/35",
  high:
    "border-orange-400/90 bg-orange-50/90 dark:border-orange-500 dark:bg-orange-950/35",
  urgent:
    "border-red-400/90 bg-red-50/90 dark:border-red-500 dark:bg-red-950/35",
};

export const PROJECT_STATUS_SELECT_TRIGGER: Record<ProjectStatus, string> = {
  planning:
    "border-violet-400/90 bg-violet-50/90 dark:border-violet-500 dark:bg-violet-950/35",
  active:
    "border-emerald-400/90 bg-emerald-50/90 dark:border-emerald-500 dark:bg-emerald-950/35",
  archived:
    "border-stone-400/90 bg-stone-100/90 dark:border-stone-500 dark:bg-stone-900/40",
};

/** Project picker row: color by that project's lifecycle status. */
export function projectRowSelectItemClass(status: ProjectStatus): string {
  return PROJECT_STATUS_SELECT_ITEM[status];
}
