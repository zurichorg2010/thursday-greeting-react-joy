
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, Loader2 } from "lucide-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signUp } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Very basic validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    try {
      setIsLoading(true);
      // Updated to match the expected 2 arguments (email, password)
      await signUp(email, password);
      navigate("/onboarding");
    } catch (error) {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-gray to-white">
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="p-0 hover:bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-brand-dark">Create your account</h1>
              <p className="text-gray-600 mt-2">Start organizing your Friday meetings</p>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-brand-purple hover:bg-brand-purple/90 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : "Sign Up"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button 
                  onClick={() => navigate("/signin")}
                  className="text-brand-purple hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
