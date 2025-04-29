
import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FileText, Loader2, Plus } from "lucide-react";
import TaskCard from "@/components/TaskCard";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import { TaskStatus } from "@/types";

const BoardPage = () => {
  const navigate = useNavigate();
  const { boardId } = useParams();
  const { user, currentProject, isAuthenticated } = useApp();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState<TaskStatus | "all">("all");
  const [currentBoard, setCurrentBoard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    
    if (currentProject) {
      const board = currentProject.boards.find(b => b.id === boardId);
      if (board) {
        setCurrentBoard(board);
      } else {
        navigate("/dashboard");
      }
    }
    
    setIsLoading(false);
  }, [boardId, currentProject, isAuthenticated, navigate]);
  
  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }
  
  if (!currentBoard) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col gap-4">
        <p>Board not found</p>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }
  
  const getFilteredTasks = () => {
    return activeStatus === "all" 
      ? currentBoard.tasks 
      : currentBoard.tasks.filter((task: any) => task.status === activeStatus);
  };
  
  const getTasksByStatus = (status: TaskStatus) => {
    return currentBoard.tasks.filter((task: any) => task.status === status);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">{currentBoard.name}</h1>
                <p className="text-gray-500">
                  {currentBoard.tasks.length} {currentBoard.tasks.length === 1 ? 'task' : 'tasks'}
                </p>
              </div>
              
              <Button
                className="bg-brand-purple hover:bg-brand-purple/90"
                onClick={() => setIsCreateTaskOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Task
              </Button>
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-lg">Tasks</h2>
              </div>
              
              <div className="p-4">
                <Tabs defaultValue="all">
                  <TabsList className="w-full justify-start border mb-6">
                    <TabsTrigger 
                      value="all" 
                      onClick={() => setActiveStatus("all")}
                      className={activeStatus === "all" ? "data-[state=active]:bg-brand-purple data-[state=active]:text-white" : ""}
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger 
                      value="backlog" 
                      onClick={() => setActiveStatus("backlog")}
                      className={activeStatus === "backlog" ? "data-[state=active]:bg-brand-purple data-[state=active]:text-white" : ""}
                    >
                      Backlog
                    </TabsTrigger>
                    <TabsTrigger 
                      value="planning" 
                      onClick={() => setActiveStatus("planning")}
                      className={activeStatus === "planning" ? "data-[state=active]:bg-brand-purple data-[state=active]:text-white" : ""}
                    >
                      Planning
                    </TabsTrigger>
                    <TabsTrigger 
                      value="working" 
                      onClick={() => setActiveStatus("working")}
                      className={activeStatus === "working" ? "data-[state=active]:bg-brand-purple data-[state=active]:text-white" : ""}
                    >
                      Working
                    </TabsTrigger>
                    <TabsTrigger 
                      value="stuck" 
                      onClick={() => setActiveStatus("stuck")}
                      className={activeStatus === "stuck" ? "data-[state=active]:bg-brand-purple data-[state=active]:text-white" : ""}
                    >
                      Stuck
                    </TabsTrigger>
                    <TabsTrigger 
                      value="done" 
                      onClick={() => setActiveStatus("done")}
                      className={activeStatus === "done" ? "data-[state=active]:bg-brand-purple data-[state=active]:text-white" : ""}
                    >
                      Done
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getFilteredTasks().length > 0 ? (
                        getFilteredTasks().map((task: any) => (
                          <TaskCard key={task.id} task={task} />
                        ))
                      ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                          <FileText className="h-12 w-12 mb-4" />
                          <h3 className="text-xl font-medium mb-2">No tasks found</h3>
                          <p className="text-sm max-w-md text-center">
                            {activeStatus === "all" 
                              ? "Start by adding your first task to this board." 
                              : `There are no tasks with status "${activeStatus}".`}
                          </p>
                          <Button
                            className="mt-4 bg-brand-purple hover:bg-brand-purple/90"
                            onClick={() => setIsCreateTaskOpen(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" /> Add Task
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Generate content for other tabs */}
                  {["backlog", "planning", "working", "stuck", "done"].map((status) => (
                    <TabsContent key={status} value={status} className="mt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {getTasksByStatus(status as TaskStatus).length > 0 ? (
                          getTasksByStatus(status as TaskStatus).map((task: any) => (
                            <TaskCard key={task.id} task={task} />
                          ))
                        ) : (
                          <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                            <FileText className="h-12 w-12 mb-4" />
                            <h3 className="text-xl font-medium mb-2">No {status} tasks</h3>
                            <p className="text-sm max-w-md text-center">
                              There are no tasks in {status}.
                            </p>
                            <Button
                              className="mt-4 bg-brand-purple hover:bg-brand-purple/90"
                              onClick={() => setIsCreateTaskOpen(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" /> Add Task
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </div>
          
          <CreateTaskDialog 
            isOpen={isCreateTaskOpen}
            onClose={() => setIsCreateTaskOpen(false)}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BoardPage;
