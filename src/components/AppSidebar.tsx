
import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Home, LogOut, Plus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const { user, signOut, currentProject, createBoard } = useApp();
  const [newBoardName, setNewBoardName] = useState("");
  const navigate = useNavigate();
  
  const handleCreateBoard = () => {
    if (newBoardName) {
      createBoard(newBoardName);
      setNewBoardName("");
    }
  };

  const navigateToBoard = (boardId: string) => {
    navigate(`/board/${boardId}`);
  };

  const navigateToHome = () => {
    navigate('/dashboard');
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="px-6 py-5 flex items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-purple rounded-md flex items-center justify-center">
            <span className="text-white font-bold">F</span>
          </div>
          <span className="font-bold text-lg">Friday</span>
        </div>
      </SidebarHeader>
      
      <Separator />
      
      <SidebarContent className="px-4 py-6">
        <div className="space-y-6">
          <div>
            <Button variant="ghost" className="w-full justify-start" onClick={navigateToHome}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
          
          <Separator />
          
          <div>
            <div className="flex items-center justify-between mb-2 px-2">
              <div className="text-sm font-medium text-gray-500">Boards</div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Board</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="board-name">Board Name</Label>
                      <Input 
                        id="board-name" 
                        value={newBoardName} 
                        onChange={(e) => setNewBoardName(e.target.value)} 
                        placeholder="Enter board name" 
                      />
                    </div>
                    <Button 
                      className="w-full bg-brand-purple hover:bg-brand-purple/90" 
                      onClick={handleCreateBoard}
                      disabled={!newBoardName}
                    >
                      Create Board
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {currentProject?.boards.map((board) => (
              <Button 
                key={board.id} 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigateToBoard(board.id)}
              >
                <div className="w-2 h-2 bg-brand-purple rounded-full mr-2"></div>
                {board.name}
              </Button>
            ))}
          </div>
        </div>
      </SidebarContent>
      
      <div className="mt-auto">
        <Separator />
        <SidebarFooter className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-2">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
