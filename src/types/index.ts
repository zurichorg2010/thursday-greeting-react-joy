
export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus = "all" | "backlog" | "planning" | "working" | "stuck" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  assignees: string[];
  dateAllocated: string;
  deadline: string;
  status: TaskStatus;
}

export interface Board {
  id: string;
  name: string;
  tasks: Task[];
}

export interface Project {
  id: string;
  name: string;
  boards: Board[];
}

export type OnboardingCategory = "work" | "personal" | "school" | "nonprofit";

export interface User {
  id: string;
  name: string;
  email: string;
  projects: Project[];
  isFirstTimer: boolean;
  onboardingCategory?: OnboardingCategory;
  isSupporter?: boolean;
}
