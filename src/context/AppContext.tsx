import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createBoard as createBoardDb, getBoards, createTask as createTaskDb, getTasks, updateTask as updateTaskDb, updateTaskStatus as updateTaskStatusDb } from "@/integrations/supabase/supabase";
import type { User, Project, Board, Task, TaskStatus, TaskPriority } from "@/types";

interface AppContextType {
  user: User | null;
  currentProject: Project | null;
  currentBoardId: string | null;
  isAuthenticated: boolean;
  isOnboarding: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => void;
  setCurrentProject: (project: Project) => void;
  setCurrentBoard: (boardId: string) => void;
  createBoard: (name: string) => void;
  createTask: (boardId: string, task: Omit<Task, "id">) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        const { email } = data.session.user;
        
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
        
        if (userData) {
          const boards = await getBoards(userData.id);
          
          const mockUser: User = {
            id: userData.id,
            name: email.split('@')[0],
            email,
            projects: [{
              id: uuidv4(),
              name: "My Project",
              boards: boards.map(board => ({
                id: board.id,
                name: board.name,
                tasks: []
              }))
            }],
            isFirstTimer: false
          };
          
          setUser(mockUser);
          setCurrentProjectState(mockUser.projects[0]);
          if (boards.length > 0) {
            setCurrentBoardId(boards[0].id);
          }
        }
      }
    };
    
    fetchSession();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          email,
          password
        })
        .select()
        .single();
      
      if (userError) throw userError;
      
      const mockUser: User = {
        id: userData.id,
        name: email.split('@')[0],
        email,
        projects: [],
        isFirstTimer: true
      };
      
      setUser(mockUser);
      setIsOnboarding(true);
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Failed to create account");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (userData) {
        const boards = await getBoards(userData.id);
        const projectBoards = await Promise.all(boards.map(async (board) => {
          const tasks = await getTasks(board.id);
          return {
            id: board.id,
            name: board.name,
            tasks: tasks.map(task => ({
              id: task.id,
              title: task.title,
              description: task.description || "",
              priority: task.priority as TaskPriority || "medium",
              assignees: task.assignees ? JSON.parse(task.assignees) : [],
              dateAllocated: task.created_at,
              deadline: task.due_date || "",
              status: task.status as TaskStatus || "backlog"
            }))
          };
        }));
        
        const mockUser: User = {
          id: userData.id,
          name: email.split('@')[0],
          email,
          projects: [{
            id: uuidv4(),
            name: "My Project",
            boards: projectBoards
          }],
          isFirstTimer: false
        };
        
        setUser(mockUser);
        setCurrentProjectState(mockUser.projects[0]);
        if (projectBoards.length > 0) {
          setCurrentBoardId(projectBoards[0].id);
        }
        toast.success("Signed in successfully");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("Failed to sign in");
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setCurrentProjectState(null);
      setCurrentBoardId(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const completeOnboarding = () => {
    if (!user) return;
    
    setUser({
      ...user,
      isFirstTimer: false
    });
    
    setIsOnboarding(false);
  };

  const setCurrentProject = (project: Project) => {
    if (!user) return;
    
    setCurrentProjectState(project);
    setCurrentBoardId(project.boards[0]?.id || null);
  };

  const setCurrentBoard = (boardId: string) => {
    setCurrentBoardId(boardId);
  };

  const createBoard = async (name: string) => {
    if (!user || !currentProject) return;
    
    try {
      const newBoard = await createBoardDb({
        name,
        user_id: user.id
      });
      
      const updatedProject = {
        ...currentProject,
        boards: [...currentProject.boards, {
          id: newBoard.id,
          name: newBoard.name,
          tasks: []
        }]
      };
      
      const updatedProjects = user.projects.map(p => 
        p.id === currentProject.id ? updatedProject : p
      );
      
      setUser({
        ...user,
        projects: updatedProjects
      });
      
      setCurrentProjectState(updatedProject);
      setCurrentBoardId(newBoard.id);
      toast.success(`Board "${name}" created`);
    } catch (error) {
      console.error("Error creating board:", error);
      toast.error("Failed to create board");
    }
  };

  const createTask = async (boardId: string, task: Omit<Task, "id">) => {
    if (!user || !currentProject) return;
    
    try {
      const newTask = await createTaskDb({
        title: task.title,
        description: task.description,
        priority: task.priority,
        assignees: JSON.stringify(task.assignees),
        board_id: boardId,
        due_date: task.deadline,
        status: task.status
      });
      
      const updatedBoards = currentProject.boards.map(board => 
        board.id === boardId 
          ? { 
              ...board, 
              tasks: [...board.tasks, {
                ...task,
                id: newTask.id
              }] 
            } 
          : board
      );
      
      const updatedProject = {
        ...currentProject,
        boards: updatedBoards
      };
      
      const updatedProjects = user.projects.map(p => 
        p.id === currentProject.id ? updatedProject : p
      );
      
      setUser({
        ...user,
        projects: updatedProjects
      });
      
      setCurrentProjectState(updatedProject);
      toast.success("Task created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user || !currentProject) return;
    
    try {
      await updateTaskDb(taskId, {
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        assignees: updates.assignees ? JSON.stringify(updates.assignees) : undefined,
        due_date: updates.deadline,
        status: updates.status
      });
      
      const updatedBoards = currentProject.boards.map(board => {
        const taskIndex = board.tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex >= 0) {
          return {
            ...board,
            tasks: [
              ...board.tasks.slice(0, taskIndex),
              { ...board.tasks[taskIndex], ...updates },
              ...board.tasks.slice(taskIndex + 1)
            ]
          };
        }
        
        return board;
      });
      
      const updatedProject = {
        ...currentProject,
        boards: updatedBoards
      };
      
      const updatedProjects = user.projects.map(p => 
        p.id === currentProject.id ? updatedProject : p
      );
      
      setUser({
        ...user,
        projects: updatedProjects
      });
      
      setCurrentProjectState(updatedProject);
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    if (!user || !currentProject) return;
    
    try {
      await updateTaskStatusDb(taskId, status);
      
      const updatedBoards = currentProject.boards.map(board => {
        const taskIndex = board.tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex >= 0) {
          return {
            ...board,
            tasks: [
              ...board.tasks.slice(0, taskIndex),
              { ...board.tasks[taskIndex], status },
              ...board.tasks.slice(taskIndex + 1)
            ]
          };
        }
        
        return board;
      });
      
      const updatedProject = {
        ...currentProject,
        boards: updatedBoards
      };
      
      const updatedProjects = user.projects.map(p => 
        p.id === currentProject.id ? updatedProject : p
      );
      
      setUser({
        ...user,
        projects: updatedProjects
      });
      
      setCurrentProjectState(updatedProject);
      toast.success("Task status updated");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const value = {
    user,
    currentProject,
    currentBoardId,
    isAuthenticated: !!user,
    isOnboarding,
    signUp,
    signIn,
    signOut,
    completeOnboarding,
    setCurrentProject,
    setCurrentBoard,
    createBoard,
    createTask,
    updateTask,
    updateTaskStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
