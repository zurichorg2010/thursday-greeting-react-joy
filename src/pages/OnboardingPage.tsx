
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Check, Loader2 } from "lucide-react";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { completeOnboarding, isAuthenticated, isOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [isSupporter, setIsSupporter] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated or not in onboarding state
  React.useEffect(() => {
    if (!isAuthenticated || !isOnboarding) {
      navigate("/");
    }
  }, [isAuthenticated, isOnboarding, navigate]);

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleCategorySelect = (value: string) => {
    setCategory(value);
    handleNextStep();
  };

  const handleSupporterSelect = (value: boolean) => {
    setIsSupporter(value);
    handleNextStep();
  };

  const handleComplete = async () => {
    if (!projectName) return;
    
    setIsLoading(true);
    
    try {
      await completeOnboarding(category, isSupporter, projectName);
      navigate("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-gray to-white flex justify-center items-center p-4">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-[70%] p-8">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex items-center">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${i + 1 === step ? 'bg-brand-purple text-white' : 
                          i + 1 < step ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}
                      `}>
                        {i + 1 < step ? <Check size={16} /> : i + 1}
                      </div>
                      {i < 3 && (
                        <div className={`w-10 h-1 ${i + 1 < step ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Hey, what brings you here?</h2>
                  <p className="text-gray-600">We'll customize your experience based on your needs.</p>
                  
                  <RadioGroup 
                    value={category} 
                    onValueChange={handleCategorySelect} 
                    className="space-y-3"
                  >
                    {["Work", "Personal", "School", "Nonprofit"].map((item) => (
                      <div 
                        key={item} 
                        className={`
                          flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-colors
                          ${category.toLowerCase() === item.toLowerCase() ? 'border-brand-purple bg-brand-purple/5' : 'border-gray-200 hover:bg-gray-50'}
                        `}
                        onClick={() => handleCategorySelect(item.toLowerCase())}
                      >
                        <RadioGroupItem 
                          value={item.toLowerCase()} 
                          id={item.toLowerCase()} 
                          className="text-brand-purple"
                        />
                        <Label htmlFor={item.toLowerCase()} className="flex-1 cursor-pointer">{item}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Would you like to support us?</h2>
                  <p className="text-gray-600">Your support helps us improve Friday Flow.</p>
                  
                  <RadioGroup 
                    value={isSupporter ? "yes" : "no"} 
                    onValueChange={(value) => handleSupporterSelect(value === "yes")}
                    className="space-y-3"
                  >
                    {[
                      { label: "Yes, I'll support Friday Flow", value: "yes" },
                      { label: "Maybe later", value: "no" }
                    ].map((item) => (
                      <div 
                        key={item.label} 
                        className={`
                          flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-colors
                          ${isSupporter === (item.value === "yes") ? 'border-brand-purple bg-brand-purple/5' : 'border-gray-200 hover:bg-gray-50'}
                        `}
                        onClick={() => handleSupporterSelect(item.value === "yes")}
                      >
                        <RadioGroupItem 
                          value={item.value} 
                          id={item.value} 
                          className="text-brand-purple" 
                        />
                        <Label htmlFor={item.value} className="flex-1 cursor-pointer">{item.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Great! Let's create your first project</h2>
                  <p className="text-gray-600">What would you like to name your project?</p>
                  
                  <div className="space-y-3">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="My Awesome Project"
                      className="text-lg"
                    />
                  </div>
                  
                  <Button 
                    className="w-full bg-brand-purple hover:bg-brand-purple/90 mt-4"
                    onClick={handleNextStep}
                    disabled={!projectName}
                  >
                    Continue
                  </Button>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">You're all set!</h2>
                  <p className="text-gray-600">We're excited to have you on board.</p>
                  
                  <div className="bg-brand-purple/10 rounded-lg p-6 border border-brand-purple/20">
                    <h3 className="font-medium text-lg text-brand-purple mb-2">Your Friday Flow Setup</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <Check size={18} className="text-green-500" />
                        <span>Purpose: <span className="font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</span></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={18} className="text-green-500" />
                        <span>Support: <span className="font-medium">{isSupporter ? "Yes" : "Not at this time"}</span></span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={18} className="text-green-500" />
                        <span>Project: <span className="font-medium">{projectName}</span></span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    className="w-full bg-brand-purple hover:bg-brand-purple/90 mt-4"
                    onClick={handleComplete}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting up...
                      </>
                    ) : "Get Started with Friday Flow"}
                  </Button>
                </div>
              )}
            </div>
            
            <div className="hidden md:block w-[30%] bg-brand-purple p-8 text-white">
              <div className="h-full flex flex-col">
                <h3 className="text-xl font-bold mb-4">Welcome to Friday Flow</h3>
                <p className="mb-6">Your solution to organized and productive Friday meetings.</p>
                
                <div className="mt-auto">
                  <div className="mb-6">
                    <div className="text-sm opacity-80 mb-2">Progress</div>
                    <div className="w-full h-2 bg-white/20 rounded-full">
                      <div 
                        className="h-full bg-white rounded-full transition-all" 
                        style={{ width: `${(step / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    Step {step} of 4
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
