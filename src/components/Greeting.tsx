
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Greeting = () => {
  const [bounce, setBounce] = useState(false);

  const handleClick = () => {
    setBounce(true);
    setTimeout(() => setBounce(false), 1000);
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleClick}>
      <div className={`text-6xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-transparent bg-clip-text transition-transform duration-500 ${bounce ? 'animate-bounce' : ''}`}>
        Hello Thursday!
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          className="bg-[#E5DEFF] hover:bg-[#D6BCFA] text-[#1A1F2C] border-none"
        >
          <Calendar className="mr-2 h-4 w-4" />
          It's Thursday!
        </Button>
      </div>
      <div className="mt-8 text-lg text-[#403E43] text-center max-w-md mx-auto">
        Click the greeting to make it bounce! Have a wonderful Thursday 🌟
      </div>
    </div>
  );
};

export default Greeting;
