
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Task } from "@/types";
import { format } from "date-fns";
import { CalendarIcon, Clock, Edit } from "lucide-react";
import { Button } from "./ui/button";
import EditTaskDialog from "./EditTaskDialog";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-priority-high text-white";
      case "medium":
        return "bg-priority-medium text-white";
      case "low":
        return "bg-priority-low text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "backlog":
        return "bg-gray-300 text-gray-700";
      case "planning":
        return "bg-brand-purple text-white";
      case "working":
        return "bg-brand-blue text-white";
      case "stuck":
        return "bg-priority-high text-white";
      case "done":
        return "bg-priority-low text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const formatDeadline = (deadline: string) => {
    return format(new Date(deadline), "MMM dd, yyyy");
  };
  
  const isDeadlineSoon = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.floor(
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 2 && diffDays >= 0;
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <Badge className={getStatusColor(task.status)}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsEditOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
            
            {task.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-1 mb-3">
              {task.assignees &&
                task.assignees.map((assignee, index) => (
                  <Badge key={index} variant="outline" className="bg-gray-50">
                    {assignee}
                  </Badge>
                ))}
            </div>
            
            <div className="flex justify-between items-center">
              {task.deadline && (
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span className={isDeadlineSoon(task.deadline) ? "text-priority-high font-medium" : ""}>
                    {formatDeadline(task.deadline)}
                  </span>
                </div>
              )}
              
              {task.priority && (
                <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isEditOpen && (
        <EditTaskDialog 
          task={task} 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
        />
      )}
    </>
  );
};

export default TaskCard;
