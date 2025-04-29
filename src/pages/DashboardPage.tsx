
import React, { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bell, 
  Calendar,
  CheckCircle, 
  CircleDashed, 
  Clock, 
  FileText, 
  Loader2, 
  Plus, 
  Search, 
  Settings,
  X
} from "lucide-react";
import { TaskStatus } from "@/types";
import TaskCard from "@/components/TaskCard";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, currentProject, currentBoardId, isAuthenticated } = useApp();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState<TaskStatus>("all");
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  if (!user || !currentProject) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }
  
  const currentBoard = currentProject.boards.find(board => board.id === currentBoardId);
  
  const getFilteredTasks = () => {
    if (!currentBoard) return [];
    return activeStatus === "all" 
      ? currentBoard.tasks 
      : currentBoard.tasks.filter(task => task.status === activeStatus);
  };
  
  const getStatusCounts = () => {
    if (!currentBoard) return { backlog: 0, planning: 0, working: 0, stuck: 0, done: 0 };
    
    return currentBoard.tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<TaskStatus, number>);
  };
  
  const getTasksByStatus = (status: TaskStatus) => {
    if (!currentBoard) return [];
    return currentBoard.tasks.filter(task => task.status === status);
  };
  
  const taskCounts = getStatusCounts();
  const totalTasks = currentBoard?.tasks.length || 0;
  const completedTasks = taskCounts.done || 0;
  const inProgressTasks = (taskCounts.working || 0) + (taskCounts.planning || 0);
  
  const getTodayTasks = () => {
    if (!currentBoard) return [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return currentBoard.tasks.filter(task => {
      const deadline = new Date(task.deadline);
      deadline.setHours(0, 0, 0, 0);
      return deadline >= today && deadline < tomorrow;
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">{currentProject.name}</h1>
                <p className="text-gray-500">
                  {currentBoard ? `${currentBoard.name} Board` : 'Select a board'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="search"
                    placeholder="Search tasks..."
                    className="pl-9 py-2 pr-4 border rounded-md text-sm w-64"
                  />
                </div>
                
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Calendar className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Bell className="h-5 w-5" />
                </Button>
                
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalTasks}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-priority-low">{completedTasks}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-brand-blue">{inProgressTasks}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Due Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-priority-high">{getTodayTasks().length}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-semibold text-lg">Task Board</h2>
                    <Button
                      className="bg-brand-purple hover:bg-brand-purple/90"
                      onClick={() => setIsCreateTaskOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Task
                    </Button>
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

                      <TabsContent value="all">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {getFilteredTasks().length > 0 ? (
                            getFilteredTasks().map(task => (
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
                      
                      <TabsContent value="backlog">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {getTasksByStatus("backlog").length > 0 ? (
                            getTasksByStatus("backlog").map(task => (
                              <TaskCard key={task.id} task={task} />
                            ))
                          ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                              <FileText className="h-12 w-12 mb-4" />
                              <h3 className="text-xl font-medium mb-2">No backlog tasks</h3>
                              <p className="text-sm max-w-md text-center">
                                There are no tasks in the backlog.
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
                      
                      <TabsContent value="planning">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {getTasksByStatus("planning").length > 0 ? (
                            getTasksByStatus("planning").map(task => (
                              <TaskCard key={task.id} task={task} />
                            ))
                          ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                              <FileText className="h-12 w-12 mb-4" />
                              <h3 className="text-xl font-medium mb-2">No planning tasks</h3>
                              <p className="text-sm max-w-md text-center">
                                There are no tasks in planning.
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
                      
                      <TabsContent value="working">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {getTasksByStatus("working").length > 0 ? (
                            getTasksByStatus("working").map(task => (
                              <TaskCard key={task.id} task={task} />
                            ))
                          ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                              <FileText className="h-12 w-12 mb-4" />
                              <h3 className="text-xl font-medium mb-2">No in-progress tasks</h3>
                              <p className="text-sm max-w-md text-center">
                                There are no tasks currently in progress.
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
                      
                      <TabsContent value="stuck">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {getTasksByStatus("stuck").length > 0 ? (
                            getTasksByStatus("stuck").map(task => (
                              <TaskCard key={task.id} task={task} />
                            ))
                          ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                              <FileText className="h-12 w-12 mb-4" />
                              <h3 className="text-xl font-medium mb-2">No stuck tasks</h3>
                              <p className="text-sm max-w-md text-center">
                                There are no tasks that are stuck.
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
                      
                      <TabsContent value="done">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {getTasksByStatus("done").length > 0 ? (
                            getTasksByStatus("done").map(task => (
                              <TaskCard key={task.id} task={task} />
                            ))
                          ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                              <FileText className="h-12 w-12 mb-4" />
                              <h3 className="text-xl font-medium mb-2">No completed tasks</h3>
                              <p className="text-sm max-w-md text-center">
                                There are no completed tasks yet.
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
                    </Tabs>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Recent Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentBoard?.tasks.slice(0, 3).map((task) => (
                        <div 
                          key={task.id}
                          className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-1">{task.title}</h4>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                {task.status === 'done' ? (
                                  <CheckCircle className="h-3 w-3 mr-1 text-priority-low" />
                                ) : task.status === 'stuck' ? (
                                  <X className="h-3 w-3 mr-1 text-priority-high" />
                                ) : task.status === 'working' ? (
                                  <Clock className="h-3 w-3 mr-1 text-brand-blue" />
                                ) : (
                                  <CircleDashed className="h-3 w-3 mr-1" />
                                )}
                                <span>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
                              </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              task.priority === 'high' ? 'bg-priority-high' :
                              task.priority === 'medium' ? 'bg-priority-medium' : 'bg-priority-low'
                            }`}></div>
                          </div>
                        </div>
                      ))}
                      
                      {(!currentBoard || currentBoard.tasks.length === 0) && (
                        <div className="text-sm text-gray-500 text-center py-2">
                          No tasks available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Status Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { status: "backlog", label: "Backlog", icon: CircleDashed, color: "text-gray-500" },
                        { status: "planning", label: "Planning", icon: FileText, color: "text-brand-purple" },
                        { status: "working", label: "Working", icon: Clock, color: "text-brand-blue" },
                        { status: "stuck", label: "Stuck", icon: X, color: "text-priority-high" },
                        { status: "done", label: "Done", icon: CheckCircle, color: "text-priority-low" },
                      ].map((item) => {
                        const count = taskCounts[item.status as TaskStatus] || 0;
                        const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                        
                        return (
                          <div key={item.status} className="flex items-center">
                            <item.icon className={`h-4 w-4 mr-2 ${item.color}`} />
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span>{item.label}</span>
                                <span>{count} ({percentage}%)</span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-100 rounded-full">
                                <div 
                                  className={`h-full rounded-full ${
                                    item.status === 'done' ? 'bg-priority-low' :
                                    item.status === 'stuck' ? 'bg-priority-high' :
                                    item.status === 'working' ? 'bg-brand-blue' :
                                    item.status === 'planning' ? 'bg-brand-purple' : 'bg-gray-400'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
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

export default DashboardPage;
