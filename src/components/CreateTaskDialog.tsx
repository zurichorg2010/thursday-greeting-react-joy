
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { Calendar, Loader2, Plus } from "lucide-react";
import { TaskPriority, TaskStatus } from "@/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({ isOpen, onClose }) => {
  const { createTask, currentBoardId } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assignee, setAssignee] = useState("");
  const [assignees, setAssignees] = useState<string[]>([]);
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<TaskStatus>("backlog");
  const [isLoading, setIsLoading] = useState(false);

  const addAssignee = () => {
    if (assignee && !assignees.includes(assignee)) {
      setAssignees([...assignees, assignee]);
      setAssignee("");
    }
  };

  const removeAssignee = (name: string) => {
    setAssignees(assignees.filter(a => a !== name));
  };

  const handleSubmit = async () => {
    if (!title || !currentBoardId) return;
    
    setIsLoading(true);
    
    const newTask = {
      title,
      description,
      priority,
      assignees,
      dateAllocated: new Date().toISOString(),
      deadline: new Date(deadline).toISOString(),
      status,
    };
    
    try {
      await createTask(currentBoardId, newTask);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignee("");
    setAssignees([]);
    setDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setStatus("backlog");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={priority}
                onValueChange={(value) => setPriority(value as TaskPriority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={status}
                onValueChange={(value) => setStatus(value as TaskStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="working">Working</SelectItem>
                  <SelectItem value="stuck">Stuck</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <div className="flex">
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="rounded-r-none"
              />
              <div className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-gray-50">
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assignees">Assignees</Label>
            <div className="flex">
              <Input
                id="assignee-input"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                placeholder="Add assignee name"
                className="rounded-r-none"
                onKeyPress={(e) => e.key === 'Enter' && addAssignee()}
              />
              <Button
                type="button"
                onClick={addAssignee}
                className="rounded-l-none"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {assignees.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {assignees.map((name, index) => (
                  <Badge key={index} variant="secondary" className="p-2">
                    {name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => removeAssignee(name)}
                    >
                      &times;
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-brand-purple hover:bg-brand-purple/90"
            disabled={!title || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : "Create Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
